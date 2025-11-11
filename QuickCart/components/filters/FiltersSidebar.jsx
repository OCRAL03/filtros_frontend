"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";

const FiltersSidebar = () => {
  const { categoriesMenu, brands, filterMeta, normalize } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();

  const c = (searchParams.get("c") || "").toLowerCase();
  const s = (searchParams.get("s") || "").toLowerCase();
  const t = (searchParams.get("t") || "").toLowerCase();

  // Precio
  const precioRango = filterMeta?.precio_rango;
  const priceMin = Number(searchParams.get("price_min") || "") || undefined;
  const priceMax = Number(searchParams.get("price_max") || "") || undefined;
  const [localPriceMin, setLocalPriceMin] = useState(priceMin ?? precioRango?.min ?? undefined);
  const [localPriceMax, setLocalPriceMax] = useState(priceMax ?? precioRango?.max ?? undefined);
  useEffect(() => {
    setLocalPriceMin(priceMin ?? precioRango?.min ?? undefined);
    setLocalPriceMax(priceMax ?? precioRango?.max ?? undefined);
  }, [priceMin, priceMax, precioRango?.min, precioRango?.max]);

  const applyPrice = () => {
    const usp = new URLSearchParams(searchParams.toString());
    if (localPriceMin !== undefined && localPriceMin !== null && localPriceMin !== "") usp.set("price_min", String(localPriceMin)); else usp.delete("price_min");
    if (localPriceMax !== undefined && localPriceMax !== null && localPriceMax !== "") usp.set("price_max", String(localPriceMax)); else usp.delete("price_max");
    router.push(`/all-products?${usp.toString()}`);
  };

  // Marcas
  const marcaIdsFromUrl = useMemo(() => {
    const ids = [];
    try {
      (searchParams.getAll("marca_id") || []).forEach((v) => ids.push(v));
      (searchParams.getAll("marca_id[]") || []).forEach((v) => ids.push(v));
    } catch {}
    return ids.filter(Boolean);
  }, [searchParams]);

  const [activeMarcaIds, setActiveMarcaIds] = useState(marcaIdsFromUrl);
  const [brandQuery, setBrandQuery] = useState("");
  useEffect(() => { setActiveMarcaIds(marcaIdsFromUrl); }, [marcaIdsFromUrl]);

  const toggleMarca = (id) => {
    const next = new Set(activeMarcaIds);
    if (next.has(String(id))) next.delete(String(id)); else next.add(String(id));
    const arr = Array.from(next);
    setActiveMarcaIds(arr);
    const usp = new URLSearchParams(searchParams.toString());
    usp.delete("marca_id"); usp.delete("marca_id[]");
    arr.forEach((v) => usp.append("marca_id[]", String(v)));
    router.push(`/all-products?${usp.toString()}`);
  };

  const filteredBrands = useMemo(() => {
    const qn = normalize(brandQuery);
    const list = Array.isArray(brands) ? brands : [];
    if (!qn) return list;
    return list.filter((b) => normalize(b?.nombre || b?.name || "").includes(qn));
  }, [brands, brandQuery, normalize]);

  // Categorías/subcategorías/tipos
  const categoriesData = Array.isArray(categoriesMenu) ? categoriesMenu : [];
  const activeCategory = categoriesData.find((cat) => normalize(cat.title) === normalize(c));
  const subcategories = (activeCategory?.columns || []).map((col) => ({ id: col.id, nombre: col.title }));
  const activeSubcategory = subcategories.find((sc) => normalize(sc.nombre) === normalize(s));
  const tiposAll = (activeCategory?.columns || []).flatMap((col) => (col.types || []).map((tp) => ({ id: tp.id, nombre: tp.name, subNombre: col.title })));
  const tipos = activeSubcategory
    ? ((activeCategory?.columns || []).find((col) => normalize(col.title) === normalize(activeSubcategory.nombre))?.types || []).map((tp) => ({ id: tp.id, nombre: tp.name }))
    : tiposAll;

  const setParam = (key, value) => {
    const usp = new URLSearchParams(searchParams.toString());
    if (value) usp.set(key, value); else usp.delete(key);
    if (key === "c") { usp.delete("s"); usp.delete("t"); }
    if (key === "s") { usp.delete("t"); }
    router.push(`/all-products?${usp.toString()}`);
  };
  const [isOpen, setIsOpen] = useState(false);

  const [showMoreCats, setShowMoreCats] = useState(false);
  const [showMoreSubs, setShowMoreSubs] = useState(false);

  const renderContent = () => (
    <>
      {/* Sección de Categoría eliminada temporalmente según indicación */}

      {precioRango && (
        <div className="border rounded">
          <div className="px-4 py-3 border-b font-medium">Precio</div>
          <div className="px-4 py-3 space-y-3">
            <div className="flex items-center gap-3">
              <input type="number" className="w-28 px-2 py-1 border rounded text-sm" placeholder="S/ mín" min={precioRango.min} max={precioRango.max} value={localPriceMin ?? ""} onChange={(e) => setLocalPriceMin(Number(e.target.value) || undefined)} />
              <span className="text-gray-500">—</span>
              <input type="number" className="w-28 px-2 py-1 border rounded text-sm" placeholder="S/ máx" min={precioRango.min} max={precioRango.max} value={localPriceMax ?? ""} onChange={(e) => setLocalPriceMax(Number(e.target.value) || undefined)} />
            </div>
            <button className="px-3 py-1.5 text-sm bg-brandRed-600 text-white rounded hover:bg-brandRed-500 shadow-softRed" onClick={applyPrice}>Aplicar</button>
          </div>
        </div>
      )}

      {Array.isArray(brands) && brands.length > 0 && (
        <div className="border rounded">
          <div className="px-4 py-3 border-b font-medium">Marca</div>
          <div className="px-4 py-3 space-y-3">
            <input type="text" value={brandQuery} onChange={(e) => setBrandQuery(e.target.value)} placeholder="Buscar marca" className="w-full px-3 py-2 border rounded text-sm" />
            <ul className="space-y-2 max-h-64 overflow-auto">
              {filteredBrands.map((b, idx) => {
                const id = b?.idMarca ?? b?.id ?? b?._id ?? idx;
                const name = b?.nombre ?? b?.name ?? String(id);
                const checked = activeMarcaIds.includes(String(id));
                return (
                  <li key={`${String(id)}-${idx}`} className="flex items-center gap-2">
                    <input id={`brand-${id}`} type="checkbox" checked={checked} onChange={() => toggleMarca(id)} />
                    <label htmlFor={`brand-${id}`} className="cursor-pointer text-sm">{name}</label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <div className="md:hidden mb-4 flex items-center justify-between">
        <button className="px-3 py-2 border rounded text-sm" onClick={() => setIsOpen(true)}>Filtrar</button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setIsOpen(false)}>
          <div className="absolute inset-y-0 left-0 w-11/12 max-w-sm bg-white shadow-xl" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b">
              <span className="font-medium">Filtrar por</span>
              <button className="text-sm px-2 py-1" onClick={() => setIsOpen(false)}>Cerrar</button>
            </div>
            <div className="p-4 space-y-6 overflow-y-auto h-[calc(100vh-56px)]">
              {renderContent()}
            </div>
          </div>
        </div>
      )}

      <aside className="hidden md:block md:w-64 lg:w-72 mr-6">
        <div className="sticky top-24 space-y-6">
          {renderContent()}
        </div>
      </aside>
    </>
  );
};

export default FiltersSidebar;

