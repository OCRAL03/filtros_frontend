"use client";
import React from "react";
import { useAppContext } from "@/context/AppContext";
import { useSearchParams, useRouter } from "next/navigation";

const CategoriesMenu = ({ className = "", horizontal = false }) => {
  const { products } = useAppContext();
  const searchParams = useSearchParams();
  const router = useRouter();
  const active = (searchParams.get("q") || "").toLowerCase();

  const categories = Array.from(
    new Set(products.map((p) => p.category).filter(Boolean))
  ).sort();

  const goToCategory = (cat) => {
    router.push(`/all-products?q=${encodeURIComponent(cat)}`);
  };

  const ulBase = horizontal
    ? `flex flex-wrap gap-3 list-none p-0 ${className}`
    : `bg-white border border-gray-300 rounded-md shadow-sm py-2 max-h-[60vh] overflow-y-auto ${className}`;

  const itemClass = (isActive) =>
    horizontal
      ? `px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-base md:text-lg hover:bg-orange-100 transition ${
          isActive ? "bg-orange-100 text-orange-700 ring-1 ring-orange-200" : ""
        }`
      : `flex w-full items-center justify-between px-4 py-2 text-sm md:text-base transition hover:bg-orange-50 ${
          isActive ? "bg-orange-50 text-orange-700" : "text-gray-700"
        }`;

  return (
    <ul className={ulBase}>
      {categories.map((cat) => {
        const isActive = active && cat.toLowerCase() === active;
        return (
          <li key={cat}>
            <button onClick={() => goToCategory(cat)} className={itemClass(isActive)}>
              <span className="truncate">{cat}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default CategoriesMenu;