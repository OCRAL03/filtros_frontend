import React, { useMemo } from "react";
import ProductCard from "./seller/ProductCard";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, router } = useAppContext()
  const MAX_HOME_ITEMS = 8;
  const limitedProducts = useMemo(() => {
    const arr = Array.isArray(products) ? products : [];
    if (arr.length <= MAX_HOME_ITEMS) return arr;
    const shuffled = [...arr].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, MAX_HOME_ITEMS);
  }, [products]);

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Productos populares</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {limitedProducts.map((product, index) => <ProductCard key={index} product={product} />)}
      </div>
      <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        Ver más
      </button>
    </div>
  );
};

export default HomeProducts;
