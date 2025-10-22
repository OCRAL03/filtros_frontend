'use client'
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import CategoryMenu from "@/components/CategoryMenu";

const AllProducts = () => {
  const { products, categoriesMenu } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const q = (searchParams.get('q') || '').toLowerCase();
  const c = (searchParams.get('c') || '').toLowerCase();
  const s = (searchParams.get('s') || '').toLowerCase();
  const t = (searchParams.get('t') || '').toLowerCase();
  
  // Paginación para reducir carga inicial
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const brandSet = useMemo(() => new Set(
    (categoriesMenu || []).flatMap(c => (c.brands || []).map(b => (b.value || b.name).toLowerCase()))
  ), [categoriesMenu]);

  const groupSet = useMemo(() => new Set(
    (categoriesMenu || []).map(c => (c.title || '').toLowerCase())
  ), [categoriesMenu]);

  const itemSet = useMemo(() => new Set(
    (categoriesMenu || []).flatMap(c => (c.items || []).map(i => (i.value || i.name).toLowerCase()))
  ), [categoriesMenu]);

  const getDerivedBrand = (p) => {
    const nameLC = (p.name || '').toLowerCase();
    const brandLC = (p.brand || '').toLowerCase();
    if (brandLC) return brandLC;
    for (const br of brandSet) {
      if (nameLC.includes(br)) return br;
    }
    return '';
  };

  const filtered = useMemo(() => {
    const normalize = (s) => (s || "").toString().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

    // Filtros jerárquicos por c, s, t
    if (c || s || t) {
      const cNorm = normalize(c);
      const sNorm = normalize(s);
      const tNorm = normalize(t);
      return products.filter(p => {
        const groupNorm = normalize(p.categoryGroup || p.category || '');
        const subNorm = normalize(p.subcategory || p.category || '');
        const typeNorms = (p.types || []).map(normalize);
        const matchC = c ? groupNorm === cNorm : true;
        const matchS = s ? subNorm === sNorm : true;
        const matchT = t ? typeNorms.includes(tNorm) : true;
        return matchC && matchS && matchT;
      });
    }

    // Fallback: búsqueda por q actual
    if (!q) return products;
    const qNorm = normalize(q);
    return products.filter(p => {
      const nameNorm = normalize(p.name || '');
      const catNorm = normalize(p.category || '');
      const groupNorm = normalize(p.categoryGroup || '');
      const prodBrand = getDerivedBrand(p);
      const brandNorm = normalize(prodBrand);

      if (brandSet.has(q) && brandNorm === qNorm) return true;
      if (groupSet.has(q) && groupNorm === qNorm) return true;
      if (itemSet.has(q) && catNorm === qNorm) return true;
      return nameNorm.includes(qNorm) || catNorm.includes(qNorm) || brandNorm.includes(qNorm) || groupNorm.includes(qNorm);
    });
  }, [products, q, c, s, t, brandSet, groupSet, itemSet]);

  // Productos paginados
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filtered.slice(startIndex, endIndex);
  }, [filtered, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const showAreas = true;

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-start px-6 md:px-16 lg:px-32">
        <div className="flex items-center justify-between w-full pt-12">
          <div className="flex flex-col items-end">
            <p className="text-2xl font-medium">Artículos</p>
            <div className="w-16 h-0.5 bg-orange-600 rounded-full"></div>
          </div>
          <div className="flex items-center gap-4 w-full justify-between">
            <div className="flex-1">
              {showAreas && (
                <div className="px-4 py-3">
                  <CategoryMenu horizontal chipWidth="w-36" className="w-full" />
                </div>
              )}
            </div>
            {/* botón de Áreas eliminado */}
          </div>
        </div>
        {q && (
          <p className="mt-4 text-sm text-gray-600">
            Resultados para: <span className="font-medium text-gray-800">{[c,s,t].filter(Boolean).join(' / ') || q}</span>
          </p>
        )}
        <div className="mt-8 w-full">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-12 pb-14 w-full">
            {paginatedProducts.map((product, index) => (
              <ProductCard key={`${currentPage}-${index}`} product={product} />
            ))}
          </div>
          
          {/* Controles de paginación */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pb-8">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
              >
                Anterior
              </button>
              
              <span className="text-sm text-gray-600">
                Página {currentPage} de {totalPages} ({filtered.length} productos)
              </span>
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AllProducts;
