"use client"
import React, { useEffect, useRef, useState } from "react";
import { assets } from "@/assets/assets";
import { getBrandsForCategory } from "@/assets/brandLogos";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {

  const { isSeller, router, categoriesMenu, products } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catsOpen, setCatsOpen] = useState(false);
  const catsRef = useRef(null);
  const categoriesData = (categoriesMenu && categoriesMenu.length) ? categoriesMenu : [];
  const [activeCatIdx, setActiveCatIdx] = useState(0);
  const [expandedCols, setExpandedCols] = useState({});

  const formatLabel = (s) => {
    const small = new Set(["de","y","del","la","las","los","el","en","para","por","con","o","u","a"]);
    const txt = (s || "").toLowerCase();
    return txt.split(/\s+/).map((w, i) => {
      if (["usb","hdmi","ps"].includes(w)) return w.toUpperCase();
      if (w === "wifi" || w === "wi-fi") return "Wi-Fi";
      if (small.has(w) && i > 0) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    }).join(" ");
  };

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) {
      router.push('/all-products');
      return;
    }
    router.push(`/all-products?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    const id = setTimeout(() => {
      const q = searchQuery.trim();
      if (q.length < 2) return; // evita push excesivos y aborts
      const target = `/all-products?q=${encodeURIComponent(q)}`;
      try {
        router.push(target);
      } catch (error) {
        console.warn('Navigation error:', error);
      }
    }, 300);
    return () => clearTimeout(id);
  }, [searchQuery, router]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catsRef.current && !catsRef.current.contains(e.target)) {
        setCatsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const computeBrandsForGroup = (groupTitle) => {
    const t = (groupTitle || '').toLowerCase();
    const set = new Set();
    for (const p of products || []) {
      if ((p.categoryGroup || '').toLowerCase() === t && p.brand) {
        set.add(p.brand);
      }
    }
    return Array.from(set).slice(0, 8).map((n) => ({ name: n, value: n }));
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
        <Image
          className="cursor-pointer w-28 md:w-32"
          onClick={() => router.push('/')}
          src={assets.logo}
          alt="logo"
        />
        <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
          <Link href="/" className="hover:text-gray-900 transition">
            Inicio
          </Link>
          <button type="button" onClick={() => setCatsOpen((prev) => !prev)} className="hover:text-gray-900 transition" aria-label="Categorías" aria-expanded={catsOpen} aria-controls="categories-menu">
            Categorías
          </button>
          <Link href="/all-products" className="hover:text-gray-900 transition">
            Tienda
          </Link>
          <Link href="/" className="hover:text-gray-900 transition">
            Nosotros
          </Link>
          <Link href="/" className="hover:text-gray-900 transition">
            Contacto
          </Link>

          {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Panel del vendedor</button>}

        </div>

        <ul className="hidden md:flex items-center gap-4 ">
          {searchOpen && (
            <>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar artículos..."
                className="w-64 sm:w-72 md:w-96 px-3 py-2 border rounded text-sm"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1 bg-brandRed-600 text-white rounded hover:bg-brandRed-500 transition shadow-softRed"
              >
                Buscar
              </button>
            </>
          )}
          <button onClick={() => setSearchOpen((prev) => !prev)} className="hover:opacity-80">
            <Image className="w-4 h-4 object-contain" src={assets.search_icon} alt="search icon" width={16} height={16} style={{ width: 'auto', height: 'auto' }} />
          </button>
          <button className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" width={18} height={18} className="w-4 h-4 object-contain" style={{ width: 'auto', height: 'auto' }} />
            Cuenta
          </button>
        </ul>

        <div className="flex items-center md:hidden gap-3">
          <button
            type="button"
            onClick={() => setCatsOpen((prev) => !prev)}
            className="px-3 py-1.5 rounded-full border text-sm bg-brandRed-50 border-brandRed-300 text-brandRed-700 hover:bg-brandRed-100 hover:border-brandRed-500 transition shadow-softRed"
            aria-label="Abrir categorías"
            aria-expanded={catsOpen}
            aria-controls="categories-menu"
          >
            Categorías
          </button>
        </div>
      </nav>

      {catsOpen && (
        <div ref={catsRef} id="categories-menu" role="region" aria-label="Menú de categorías" className="border-t bg-white shadow-xl w-full">
          <div className="w-full px-6 md:px-16 lg:px-32 py-8">
            <div className="flex">
              {/* Lista lateral de categorías */}
              <aside className="w-72 border-r max-h-[60vh] overflow-y-auto">
                <ul className="divide-y">
                  {categoriesData.map((category, idx) => (
                    <li key={idx}>
                      <button
                        onMouseEnter={() => setActiveCatIdx(idx)}
                        onClick={() => { router.push(`/all-products?c=${encodeURIComponent(category.title)}`); setCatsOpen(false); }}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm md:text-base ${idx === activeCatIdx ? 'bg-brandRed-50 text-brandRed-700' : 'hover:bg-brandRed-50 text-gray-700'}`}
                      >
                        <span>{formatLabel(category.title)}</span>
                        <span className="text-gray-400">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              <section className="flex-1 w-full px-4 md:px-8">
                {(() => {
                  const cat = categoriesData[activeCatIdx] || {};
                  const autoBrands = getBrandsForCategory(cat.title);
                  const brandsToShow = (cat.brands && cat.brands.length)
                    ? cat.brands
                    : (autoBrands.length ? autoBrands : computeBrandsForGroup(cat.title));
                  return (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4 mb-6">
                        {brandsToShow?.slice(0, 12).map((brand, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => { const q = (brand.value || brand.name).toLowerCase(); router.push(`/all-products?q=${encodeURIComponent(q)}`); setCatsOpen(false); }}
                            className="flex flex-col items-center gap-2 group"
                            aria-label={`Marca ${brand.name}`}
                          >
                            <div className="w-16 h-16 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-700 overflow-hidden">
                              {brand.logo ? (
                                <Image
                                  src={brand.logo}
                                  alt={`${brand.name} logo`}
                                  width={40}
                                  height={40}
                                  className="w-10 h-10 object-contain"
                                  unoptimized
                                  loading="lazy"
                                  style={{ width: 'auto', height: 'auto' }}
                                  onError={(e) => { try { e.currentTarget.style.display = 'none'; } catch {} }}
                                />
                              ) : (
                                <span className="text-base font-medium">{brand.name?.[0] || '?'}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-gray-900">{formatLabel(brand.name)}</span>
                          </button>
                        ))}
                      </div>

                      <div className="border-t my-4" />

                      {cat.columns && cat.columns.length ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                          {cat.columns.map((col, i) => (
                            <div key={i} className="min-w-[180px]">
                              <button
                                type="button"
                                onClick={() => {
                                  const group = cat.title;
                                  const sub = col.title;
                                  const usp = new URLSearchParams();
                                  usp.set('c', String(group));
                                  usp.set('s', String(sub));
                                  // Al elegir subcategoría directa, limpiar tipo
                                  const url = `/all-products?${usp.toString()}`;
                                  router.push(url);
                                  setCatsOpen(false);
                                }}
                                className="text-left w-full text-sm font-semibold text-gray-800 mb-2 hover:text-orange-700 hover:underline"
                                aria-label={`Filtrar por subcategoría ${col.title}`}
                              >
                                {formatLabel(col.title)}
                              </button>
                              {(() => {
                                const colKey = String(col?.id ?? `${cat.title}|${col.title}`);
                                const items = Array.isArray(col.items) ? col.items : [];
                                const expanded = !!expandedCols[colKey];
                                const visibleItems = expanded ? items : items.slice(0, 4);
                                return (
                                  <>
                                    <ul className={expanded ? "grid grid-cols-2 sm:grid-cols-3 gap-x-3 gap-y-1" : "space-y-1"}>
                                      {visibleItems.map((name, j) => (
                                        <li key={j}>
                                          <button
                                            onClick={() => {
                                              const group = cat.title;
                                              const sub = col.title;
                                              const type = name;
                                              router.push(`/all-products?c=${encodeURIComponent(group)}&s=${encodeURIComponent(sub)}&t=${encodeURIComponent(type)}`);
                                              setCatsOpen(false);
                                            }}
                                            className="text-sm text-gray-600 hover:text-orange-700 hover:underline"
                                            aria-label={`Tipo ${name}`}
                                          >
                                            {formatLabel(name)}
                                          </button>
                                        </li>
                                      ))}
                                    </ul>
                                    {!expanded && items.length > 4 && (
                                      <button
                                        type="button"
                                        onClick={() => setExpandedCols((prev) => ({ ...prev, [colKey]: true }))}
                                        className="mt-2 text-xs text-gray-600 hover:text-orange-700 hover:underline"
                                      >
                                        Ver más
                                      </button>
                                    )}
                                    {expanded && items.length > 4 && (
                                      <button
                                        type="button"
                                        onClick={() => setExpandedCols((prev) => ({ ...prev, [colKey]: false }))}
                                        className="mt-2 text-xs text-gray-600 hover:text-orange-700 hover:underline"
                                      >
                                        Ver menos
                                      </button>
                                    )}
                                  </>
                                );
                              })()}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <ul className="flex flex-wrap gap-3 list-none p-0">
                          {cat.items?.map((item, itemIdx) => (
                            <li key={itemIdx}>
                              <button
                                onClick={() => {
                                  const group = cat.title;
                                  const type = item.value || item.name;
                                  router.push(`/all-products?c=${encodeURIComponent(group)}&t=${encodeURIComponent(type)}`);
                                }}
                                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm md:text-base rounded-full border border-gray-200 bg-gray-50 text-gray-700 hover:bg-orange-50 hover:border-orange-200 hover:text-orange-700 transition"
                                aria-label={`Subcategoría ${item.name}`}
                              >
                                <span className="truncate">{formatLabel(item.name)}</span>
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })()}
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;