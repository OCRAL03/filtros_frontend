"use client"
import React, { useEffect, useRef, useState } from "react";
import { assets, navCategories } from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";

const Navbar = () => {

  const { isSeller, router } = useAppContext();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [catsOpen, setCatsOpen] = useState(false);
  const catsRef = useRef(null);
  const categoriesData = navCategories;
  const [activeCatIdx, setActiveCatIdx] = useState(0);

  const handleSearch = () => {
    const q = searchQuery.trim();
    if (!q) return;
    router.push(`/all-products?q=${encodeURIComponent(q)}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (catsRef.current && !catsRef.current.contains(e.target)) {
        setCatsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
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
          <button onClick={() => setCatsOpen((prev) => !prev)} className="hover:text-gray-900 transition">
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
                className="border rounded px-3 py-1 text-sm w-60"
                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              />
              <button
                onClick={handleSearch}
                className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
              >
                Buscar
              </button>
            </>
          )}
          <button onClick={() => setSearchOpen((prev) => !prev)} className="hover:opacity-80">
            <Image className="w-4 h-4" src={assets.search_icon} alt="search icon" />
          </button>
          <button className="flex items-center gap-2 hover:text-gray-900 transition">
            <Image src={assets.user_icon} alt="user icon" />
            Cuenta
          </button>
        </ul>

        <div className="flex items-center md:hidden gap-3">
          {/* mobile actions unchanged */}
        </div>
      </nav>

      {catsOpen && (
        <div ref={catsRef} className="border-t bg-white shadow-xl w-full">
          <div className="w-full px-6 md:px-16 lg:px-32 py-8">
            <div className="flex">
              {/* Lista lateral de categorías */}
              <aside className="w-72 border-r max-h-[60vh] overflow-y-auto">
                <ul className="divide-y">
                  {categoriesData.map((category, idx) => (
                    <li key={idx}>
                      <button
                        onMouseEnter={() => setActiveCatIdx(idx)}
                        className={`w-full flex items-center justify-between px-4 py-3 text-sm md:text-base ${idx === activeCatIdx ? 'bg-orange-50 text-orange-700' : 'hover:bg-orange-50 text-gray-700'}`}
                      >
                        <span>{category.title}</span>
                        <span className="text-gray-400">›</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </aside>

              {/* Panel derecho: marcas + subcategorías */}
              <section className="flex-1 px-8">
                {(() => {
                  const cat = categoriesData[activeCatIdx] || {};
                  return (
                    <div>
                      {/* Fila de marcas (máximo 5) */}
                      <div className="flex flex-wrap items-center gap-6 mb-6">
                        {cat.brands?.slice(0, 5).map((brand, bIdx) => (
                          <button
                            key={bIdx}
                            onClick={() => { setCatsOpen(false); router.push(`/all-products?q=${encodeURIComponent(brand.value || brand.name)}`); }}
                            className="flex flex-col items-center gap-2 group"
                            aria-label={`Marca ${brand.name}`}
                          >
                            <div className="w-16 h-16 rounded-full bg-gray-100 group-hover:bg-orange-100 flex items-center justify-center text-gray-700 overflow-hidden">
                              {brand.logo ? (
                                <Image
                                  src={brand.logo}
                                  alt={`${brand.name} logo`}
                                  width={48}
                                  height={48}
                                  className="w-10 h-10 object-contain"
                                />
                              ) : (
                                <span className="text-base font-medium">{brand.name[0]}</span>
                              )}
                            </div>
                            <span className="text-xs text-gray-600 group-hover:text-gray-900">{brand.name}</span>
                          </button>
                        ))}
                      </div>

                      <div className="border-t my-4" />

                      {/* Subcategorías */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-3">
                        {cat.items?.map((item, itemIdx) => (
                          <button
                            key={itemIdx}
                            onClick={() => { setCatsOpen(false); router.push(`/all-products?q=${encodeURIComponent(item.value || item.name)}`); }}
                            className="text-sm md:text-base text-gray-700 hover:text-orange-600 text-left"
                          >
                            {item.name}
                          </button>
                        ))}
                      </div>
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