'use client'
import ProductCard from "@/components/seller/ProductCard";
import VirtualProductGrid from "@/components/VirtualProductGrid";
import Navbar from "@/components/Navbar";
import Footer from "@/components/base/FooterIcons";
import { useAppContext } from "@/context/AppContext";

import { useSearchParams, useRouter } from "next/navigation";
import { useFilters } from "@/components/filters/useFilters";
import React, { useMemo, useState, useEffect, useRef } from "react";
import FiltersSidebar from "@/components/filters/FiltersSidebar";
import CategoryMenu from "@/components/filters/CategoryMenu";
  import ProductTypeCarousel from "@/components/filters/ProductTypeCarousel";
  import { getProductosFiltered } from "@/context/producto-api";  
  import AdvancedFilterButton from "@/components/filters/AdvancedFilterButton";

const AllProducts = () => {
  const { products, categoriesMenu, fetchProductsByFilters, brands, filterMeta, pagination } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { category: c, subcategory: s, type: t } = useFilters();
  const q = (searchParams.get('q') || '').toLowerCase();
  const [didHydrateFromStorage, setDidHydrateFromStorage] = useState(false);
  
  const resolveIds = () => {
    const normalize = (s) => (s || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
    let categoriaId = undefined;
    let subcategoriaId = undefined;
    let tipoProductoId = undefined;
    const cNorm = normalize(c);
    const sNorm = normalize(s);
    const tNorm = normalize(t);
    for (const group of categoriesMenu || []) {
      if (c && normalize(group.title) === cNorm) {
        categoriaId = group.id;
        for (const col of group.columns || []) {
          if (s && normalize(col.title) === sNorm) {
            subcategoriaId = col.id;
          }
          if (t && !tipoProductoId) {
            const hit = (col.types || []).find((tp) => normalize(tp.name) === tNorm);
            if (hit) tipoProductoId = hit.id;
          }
        }
      }
    }
    return { categoriaId, subcategoriaId, tipoProductoId };
  };
  
  const [currentPage, setCurrentPage] = useState(1);
  const LIMIT_OPTIONS = [10, 15, 20];
  const [limitIdx, setLimitIdx] = useState(2); 
  const itemsPerPage = LIMIT_OPTIONS[limitIdx];

  useEffect(() => {
    if (pagination.page !== currentPage) {
      setCurrentPage(pagination.page);
    }
  }, [pagination.page]);

  // Sync desde la URL: si hay ?page y/o ?limit, reflejar en el estado
  useEffect(() => {
    const pageParam = searchParams.get('page');
    const limitParam = searchParams.get('limit');

    const parsedPage = pageParam ? Number(pageParam) : undefined;
    if (parsedPage && parsedPage > 0 && parsedPage !== currentPage) {
      setCurrentPage(parsedPage);
    }

    const parsedLimit = limitParam ? Number(limitParam) : undefined;
    if (parsedLimit && LIMIT_OPTIONS.includes(parsedLimit)) {
      const idx = LIMIT_OPTIONS.indexOf(parsedLimit);
      if (idx !== limitIdx) setLimitIdx(idx);
    }
  }, [searchParams]);

  const marcaIdsFromUrl = useMemo(() => {
    const ids = [];
    try {
      (searchParams.getAll('marca_id') || []).forEach((v) => ids.push(v));
      (searchParams.getAll('marca_id[]') || []).forEach((v) => ids.push(v));
    } catch {}
    return ids.filter(Boolean);
  }, [searchParams]);

  const listedProducts = products;
  const [visibleCount, setVisibleCount] = useState(30);

  useEffect(() => {
    setVisibleCount((prev) => {
      const initial = itemsPerPage || 30;
      if (!Array.isArray(listedProducts)) return initial;
      return Math.min(listedProducts.length, Math.max(initial, prev));
    });
  }, [listedProducts, itemsPerPage]);

  // Usar SIEMPRE metadatos del backend si existen
  const totalItems = Number(pagination?.total ?? 0);
  const effectiveLimit = Number(pagination?.limit ?? itemsPerPage);
  const effectivePage = Number(pagination?.page ?? currentPage);
  const totalPages = Math.max(1, Math.ceil((totalItems || 0) / (effectiveLimit || 1)));

  // Con metadatos, asumimos paginación de servidor: no hacer slicing
  const isServerPaginated = Boolean(totalItems) && Boolean(effectiveLimit);
  const pageStartIdx = Math.max(0, (effectivePage - 1) * effectiveLimit);
  const pageEndIdx = Math.min(listedProducts.length, pageStartIdx + effectiveLimit);
  const pagedItems = isServerPaginated ? listedProducts : listedProducts.slice(pageStartIdx, pageEndIdx);
  const displayingCount = isServerPaginated ? Math.min(effectiveLimit, listedProducts.length) : Math.max(0, pageEndIdx - pageStartIdx);

  const isPreviousDisabled = effectivePage <= 1;
  const isNextDisabled = effectivePage >= totalPages;
  const showAreas = true;

  const priceMin = Number(searchParams.get('price_min') || '') || undefined;
  const priceMax = Number(searchParams.get('price_max') || '') || undefined;
  const atributosFromUrl = useMemo(() => {
    const obj = {};
    try {
      for (const [key, val] of searchParams.entries()) {
        const m = key.match(/^atributos\[(.+)\]$/);
        if (m && m[1]) {
          const k = m[1];
          obj[k] = String(val);
        }
      }
    } catch {}
    return obj;
  }, [searchParams]);

  useEffect(() => {
    const ac = new AbortController();
    const usp = new URLSearchParams(searchParams.toString());
    const { categoriaId, subcategoriaId, tipoProductoId } = resolveIds();
    const params = {};
    const isNumeric = (v) => {
      const s = String(v ?? '').trim();
      return s !== '' && /^\d+$/.test(s);
    };
    if (isNumeric(tipoProductoId)) params["idTipoProducto"] = Number(tipoProductoId);
    else if (isNumeric(subcategoriaId)) params["idSubCategoria"] = Number(subcategoriaId);
    else if (isNumeric(categoriaId)) params["idCategoria"] = Number(categoriaId);

    const cRaw = (usp.get('c') || usp.get('categoria') || '').toLowerCase();
    const sRaw = (usp.get('s') || usp.get('subcategoria') || '').toLowerCase();
    const tRaw = (usp.get('t') || usp.get('tipo') || '').toLowerCase();
    // Enviar nombres solo si NO resolvimos IDs, para evitar combinaciones conflictivas
    // Enviar nombres con las claves que el backend espera
    if (!categoriaId && cRaw) params["categoria"] = cRaw;
    if (!subcategoriaId && sRaw) params["subcategoria"] = sRaw;
    if (!tipoProductoId && tRaw) params["tipo"] = tRaw;

    const marcaIds = (usp.getAll('marca_id') || []).concat(usp.getAll('marca_id[]') || []);
    // El backend espera 'marcas' como lista separada por comas; nuestro builder convierte arrays a coma
    if (marcaIds.length > 0) params["marcas"] = marcaIds.map((v) => Number(v)).filter((n) => !Number.isNaN(n));

    const priceMinStr = usp.get('price_min');
    const priceMaxStr = usp.get('price_max');
    const pm = priceMinStr ? Number(priceMinStr) : undefined;
    const px = priceMaxStr ? Number(priceMaxStr) : undefined;
    if (pm !== undefined && !Number.isNaN(pm)) params['price_min'] = pm;
    if (px !== undefined && !Number.isNaN(px)) params['price_max'] = px;

    const qRaw = (usp.get('q') || usp.get('busqueda') || '').trim();
    if (qRaw) params["busqueda"] = qRaw;

    // Tiendas
    const tiendaIds = (usp.getAll('tienda_id') || []).concat(usp.getAll('tienda_id[]') || []);
    // El backend acepta 'tiendas' o 'tienda_id' como coma-separated; usamos 'tiendas'
    if (tiendaIds.length > 0) params["tiendas"] = tiendaIds.map((v) => Number(v)).filter((n) => !Number.isNaN(n));

    // Añadir paginación explícita para que el backend devuelva metadatos correctos
    if (typeof currentPage === 'number' && currentPage > 0) {
      params['page'] = currentPage;
    }
    if (typeof itemsPerPage === 'number' && itemsPerPage > 0) {
      params['limit'] = itemsPerPage;
    }

    try {
      if (process.env.NEXT_PUBLIC_DEBUG_FILTERS === '1') {
        console.log('[QuickCart][Filters] Fetch', { params, resolved: { categoriaId, subcategoriaId, tipoProductoId } });
      }
    } catch {}
    fetchProductsByFilters(params, { signal: ac.signal });
    return () => {
      ac.abort();
    };

  }, [c, s, t, q, categoriesMenu, currentPage, marcaIdsFromUrl, priceMin, priceMax, /*atributosFromUrl,*/ itemsPerPage, searchParams]);
  
  useEffect(() => {
    return () => {
    };
  }, [c, s, t, q, categoriesMenu, currentPage, marcaIdsFromUrl, priceMin, priceMax, itemsPerPage]);

  useEffect(() => {
    try {
      const obj = { c, s, t };
      localStorage.setItem('quickcart_filters', JSON.stringify(obj));
    } catch {}
  }, [c, s, t]);

  useEffect(() => {
    if (didHydrateFromStorage) return;
    const hasParams = Boolean(c || s || t || q);
    if (hasParams) { setDidHydrateFromStorage(true); return; }
    try {
      const raw = localStorage.getItem('quickcart_filters');
      if (!raw) { setDidHydrateFromStorage(true); return; }
      const saved = JSON.parse(raw || '{}');
      const usp = new URLSearchParams(searchParams.toString());
      if (saved?.c) usp.set('c', String(saved.c));
      if (saved?.s) usp.set('s', String(saved.s));
      if (saved?.t) usp.set('t', String(saved.t));
      setDidHydrateFromStorage(true);
      router.push(`/all-products?${usp.toString()}`);
    } catch {
      setDidHydrateFromStorage(true);
    }
  }, []);

  const [activeMarcaIds, setActiveMarcaIds] = useState(marcaIdsFromUrl);
  useEffect(() => { setActiveMarcaIds(marcaIdsFromUrl); }, [marcaIdsFromUrl]);

  const toggleMarca = (id) => {
    const next = new Set(activeMarcaIds);
    if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
    const arr = Array.from(next);
    setActiveMarcaIds(arr);
    const usp = new URLSearchParams(searchParams.toString());
    usp.delete('marca_id'); usp.delete('marca_id[]');
    arr.forEach(v => usp.append('marca_id[]', String(v)));
    router.push(`/all-products?${usp.toString()}`);
  };

  const precioRango = filterMeta?.precio_rango;
  const atributosDisponibles = filterMeta?.atributos_disponibles || {};
  const [localPriceMin, setLocalPriceMin] = useState(priceMin ?? precioRango?.min ?? undefined);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax ?? precioRango?.max ?? undefined);
  useEffect(() => {
    setLocalPriceMin(priceMin ?? precioRango?.min ?? undefined);
    setLocalPriceMax(priceMax ?? precioRango?.max ?? undefined);
  }, [priceMin, priceMax, precioRango?.min, precioRango?.max]);

  const updatePriceRange = (min, max) => {
    const usp = new URLSearchParams(searchParams.toString());
    if (min !== undefined && min !== null && min !== '') usp.set('price_min', String(min)); else usp.delete('price_min');
    if (max !== undefined && max !== null && max !== '') usp.set('price_max', String(max)); else usp.delete('price_max');
    router.push(`/all-products?${usp.toString()}`);
  };

  const [selectedAttrs, setSelectedAttrs] = useState(atributosFromUrl);
  useEffect(() => { setSelectedAttrs(atributosFromUrl); }, [atributosFromUrl]);

  const toggleAttrValue = (key, value) => {
    const current = (selectedAttrs?.[key] || '').split(',').filter(Boolean);
    const set = new Set(current);
    if (set.has(String(value))) set.delete(String(value)); else set.add(String(value));
    const joined = Array.from(set).join(',');
    const usp = new URLSearchParams(searchParams.toString());
    const paramKey = `atributos[${key}]`;
    if (joined) usp.set(paramKey, joined); else usp.delete(paramKey);
    router.push(`/all-products?${usp.toString()}`);
  };

  // Estado para mostrar/ocultar el panel lateral de filtros
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-12 lg:px-20 xl:px-28">
        <div className="w-full pt-12">
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-col items-start">
              <h1 className="text-3xl font-semibold tracking-tight">Todos los productos</h1>
              <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
            </div>
            <div className="flex items-center gap-2 flex-wrap justify-end">
              {(q || c || s || t || activeMarcaIds.length > 0 || priceMin !== undefined || priceMax !== undefined) && (
                <div className="flex flex-wrap items-center gap-2">
                  {c && (
                    <FilterChip label={`Categoría: ${c}`} onClear={() => {
                      const usp = new URLSearchParams(searchParams.toString());
                      usp.delete('c'); router.push(`/all-products?${usp.toString()}`);
                    }} />
                  )}
                  {s && (
                    <FilterChip label={`Subcategoría: ${s}`} onClear={() => {
                      const usp = new URLSearchParams(searchParams.toString());
                      usp.delete('s'); router.push(`/all-products?${usp.toString()}`);
                    }} />
                  )}
                  {t && (
                    <FilterChip label={`Tipo: ${t}`} onClear={() => {
                      const usp = new URLSearchParams(searchParams.toString());
                      usp.delete('t'); router.push(`/all-products?${usp.toString()}`);
                    }} />
                  )}
                  {activeMarcaIds.map((id) => (
                    <FilterChip key={`m-${id}`} label={`Marca: ${id}`} onClear={() => toggleMarca(id)} />
                  ))}
                  {priceMin !== undefined && (
                    <FilterChip label={`Precio mín: ${priceMin}`} onClear={() => updatePriceRange(undefined, priceMax)} />
                  )}
                  {priceMax !== undefined && (
                    <FilterChip label={`Precio máx: ${priceMax}`} onClear={() => updatePriceRange(priceMin, undefined)} />
                  )}
                  {q && (
                    <FilterChip label={`Búsqueda: ${q}`} onClear={() => {
                      const usp = new URLSearchParams(searchParams.toString());
                      usp.delete('q'); router.push(`/all-products?${usp.toString()}`);
                    }} />
                  )}
                </div>
              )}
              <AdvancedFilterButton />
            </div>
          </div>
          <div className="flex items-center gap-4 w-full justify-between mt-2">
            <div className="flex-1">
              {showAreas && (
                <div className="full-bleed px-2 sm:px-3 md:px-4 py-3 border-y border-gray-100 bg-white/70 backdrop-blur">
                  <CategoryMenu horizontal chipWidth="w-36" className="w-full" showSubcategories />
                </div>
              )}
            </div>
          </div>
          <div className="full-bleed px-2 sm:px-3 md:px-4 py-3 border-y border-red-100 bg-red-50/70 backdrop-blur">
            <ProductTypeCarousel
              categoriesMenu={categoriesMenu}
              c={c}
              s={s}
              t={t}
              searchParams={searchParams}
              router={router}              
              className="w-full"
              theme="red"
            />
          </div>
          {/* Botón de filtros avanzado ahora está arriba, junto al título */}
        </div>
        {(precioRango || Object.keys(atributosDisponibles).length > 0) && (
          <div className="w-full px-4 py-4 border rounded-lg border-gray-200 mt-5 bg-white shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-gray-700">Resultados por página</span>
              <input
                type="range"
                min={0}
                max={2}
                step={1}
                value={limitIdx}
                onChange={(e) => setLimitIdx(Number(e.target.value))}
                className="w-40"
              />
              <div className="flex items-center gap-2 text-xs text-gray-600">
                {LIMIT_OPTIONS.map((v, i) => (
                  <span key={v} className={i === limitIdx ? 'font-medium text-gray-800' : ''}>{v}</span>
                ))}
              </div>
            </div>
            {precioRango && (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm text-gray-700">Precio</span>
                <input
                  type="number"
                  min={precioRango.min}
                  max={precioRango.max}
                  value={localPriceMin ?? ''}
                  onChange={(e) => setLocalPriceMin(Number(e.target.value) || undefined)}
                  onBlur={() => updatePriceRange(localPriceMin, localPriceMax)}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  placeholder="mín"
                />
                <span className="text-gray-500">—</span>
                <input
                  type="number"
                  min={precioRango.min}
                  max={precioRango.max}
                  value={localPriceMax ?? ''}
                  onChange={(e) => setLocalPriceMax(Number(e.target.value) || undefined)}
                  onBlur={() => updatePriceRange(localPriceMin, localPriceMax)}
                  className="w-24 px-2 py-1 border rounded text-sm"
                  placeholder="máx"
                />
              </div>
            )}
            {Object.entries(atributosDisponibles).map(([k, values]) => (
              <div key={k} className="mb-2">
                <span className="text-sm text-gray-700 mr-2">{k}</span>
                <div className="flex flex-wrap gap-2">
                  {(values || []).map((val) => {
                    const active = (selectedAttrs?.[k] || '').split(',').includes(String(val));
                    return (
                      <div
                        key={`${k}-${val}`}
                        role="button"
                        tabIndex={0}
                        onClick={() => toggleAttrValue(k, val)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') toggleAttrValue(k, val); }}
                        className={`px-3 py-1.5 text-xs rounded-md border transition cursor-pointer ${active ? 'bg-brandRed-600 text-white border-brandRed-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-brandRed-50 hover:border-brandRed-300 hover:text-brandRed-700'}`}
                      >
                        {String(val)}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Chips movidos junto al botón de Filtrar en el header */}
        <div className="w-full">
          <div className="mt-8 w-full">
            <div className="mt-12 pb-6 w-full">
              <VirtualProductGrid
                items={pagedItems}
                rowHeight={340}
                overscan={2}
                renderItem={(product, idx) => (
                  <ProductCard key={`${String(product?._id ?? 'noid')}-${idx}`} product={product} />
                )}
              />
            </div>
          
          <div className="flex justify-center items-center gap-4 mt-12 pb-16">
            <button
              onClick={() => {
                if (!isPreviousDisabled) {
                  const target = Math.max(1, effectivePage - 1);
                  const usp = new URLSearchParams(searchParams.toString());
                  usp.set('page', String(target));
                  usp.set('limit', String(itemsPerPage));
                  router.push(`/all-products?${usp.toString()}`);
                  setCurrentPage(target);
                }
              }}
              disabled={isPreviousDisabled}
              className="px-4 py-2 bg-brandRed-50 border border-brandRed-300 text-brandRed-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brandRed-100 hover:border-brandRed-500 transition shadow-softRed"
            >
              Anterior
            </button>
            
            <span className="text-sm text-gray-600">
              página {effectivePage} de {totalPages} ({totalItems} productos total, mostrando {effectiveLimit})
            </span>
            
            <button
              onClick={() => {
                if (!isNextDisabled) {
                  const target = effectivePage + 1;
                  const usp = new URLSearchParams(searchParams.toString());
                  usp.set('page', String(target));
                  usp.set('limit', String(itemsPerPage));
                  router.push(`/all-products?${usp.toString()}`);
                  setCurrentPage(target);
                }
              }}
              disabled={isNextDisabled}
              className="px-4 py-2 bg-brandRed-50 border border-brandRed-300 text-brandRed-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-brandRed-100 hover:border-brandRed-500 transition shadow-softRed"
            >
              Siguiente
            </button>
          </div>
          </div>
        </div>
      
      <Footer />
    </div>
    </>
  );
}

// Chip reutilizable para filtros activos
function FilterChip({ label, onClear }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-brandRed-50 text-brandRed-700 border border-brandRed-300 rounded-md hover:bg-brandRed-100 hover:border-brandRed-500 transition">
      {label}
      <button
        type="button"
        aria-label="Quitar filtro"
        onClick={onClear}
        className="ml-1 px-2 py-1 rounded bg-white border border-brandRed-300 text-brandRed-700 hover:bg-brandRed-50 hover:border-brandRed-500"
      >
        ✕
      </button>
    </span>
  );
}

export default AllProducts;
