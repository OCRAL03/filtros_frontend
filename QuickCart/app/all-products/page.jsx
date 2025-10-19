"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { assets, navCategories } from "@/assets/assets";
import { AreaMenu } from "@/components/AreaMenu";

const AllProducts = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const qParam = searchParams.get("q");
  const q = qParam ? qParam.toLowerCase() : "";

  const products = assets.productsDummyData || [];

  const brandValues = useMemo(() => {
    try {
      return (navCategories || [])
        .flatMap((cat) => (cat.brands || []).map((b) => (b.value || b.name || "").toLowerCase()))
        .filter(Boolean);
    } catch (e) {
      return [];
    }
  }, []);

  const isBrandQuery = q && brandValues.includes(q);

  const filtered = useMemo(() => {
    if (!q) return products;

    return products.filter((p) => {
      const name = (p.name || "").toLowerCase();
      const category = (p.category || "").toLowerCase();
      const brand = (p.brand || "").toLowerCase();

      if (isBrandQuery) {
        const derivedBrand = brand || (brandValues.find((bv) => name.startsWith(bv)) || "");
        return derivedBrand === q;
      }

      return name.includes(q) || category.includes(q);
    });
  }, [products, q, isBrandQuery, brandValues]);

  const [showAreas, setShowAreas] = useState(false);

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl sm:text-3xl font-semibold">Artículos</h1>
        <button
          className="px-3 py-2 text-sm sm:text-base border rounded hover:bg-gray-100"
          onClick={() => setShowAreas((s) => !s)}
        >
          Áreas
        </button>
      </div>

      {showAreas && (
        <div className="mt-3">
          <AreaMenu />
        </div>
      )}

      {q && (
        <p className="mt-2 text-sm text-gray-600">
          Filtrando por: <span className="font-medium">{qParam}</span>
        </p>
      )}

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div key={item.id} className="border rounded p-3">
            <div className="relative w-full h-36 sm:h-44">
              <Image src={item.image} alt={item.name} fill className="object-contain" />
            </div>
            <h3 className="mt-2 text-sm sm:text-base font-medium">{item.name}</h3>
            <p className="text-xs sm:text-sm text-gray-600">{item.category}</p>
            <p className="text-xs sm:text-sm text-gray-600">${item.price}</p>
          </div>
        ))}

        {!filtered.length && (
          <div className="col-span-full text-center text-gray-600">No hay productos para este filtro.</div>
        )}
      </div>
    </div>
  );
};

export default AllProducts;
