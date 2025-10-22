'use client'
import React from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAppContext } from "@/context/AppContext";

const CategoryMenu = ({ className = "", horizontal = false, chipWidth = "w-36" }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { categoriesMenu } = useAppContext();
  const activeC = (searchParams.get("c") || "").toLowerCase();

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

  const DISPLAY_OVERRIDES = {
    'electrónica y tecnología': 'Tecnología',
    'linea blanca y electrodomésticos': 'Línea Blanca',
    'línea blanca y electrodomésticos': 'Línea Blanca',
    'línea blanca y electrohogar': 'Línea Blanca',
    'muebles y decoración': 'Muebles',
    'hogar y organización': 'Hogar',
    'belleza y cuidado personal': 'Belleza',
    'juguetes y entretenimiento': 'Juguetes',
    'motos y movilidad eléctrica': 'Movilidad',
  };

  const getDisplay = (txt) => {
    const key = (txt || '').toLowerCase().trim();
    if (DISPLAY_OVERRIDES[key] !== undefined) return DISPLAY_OVERRIDES[key];
    return formatLabel(txt);
  };

  const fallbackCategories = [
    { name: "Tecnología", value: "Electrónica y Tecnología" },   
    { name: "Línea Blanca", value: "Línea Blanca y Electrodomésticos" },     
    { name: "Muebles", value: "Muebles y Decoración" },
    { name: "Hogar", value: "Hogar y Organización" },
    { name: "Belleza", value: "Belleza y Cuidado Personal" },
    { name: "Juguetes", value: "Juguetes y Entretenimiento" },
    { name: "Movilidad", value: "Motos y Movilidad Eléctrica" },
  ];

  const categoriesRaw = (categoriesMenu && categoriesMenu.length)
    ? categoriesMenu.map((g) => ({ name: g.title, value: g.title }))
    : fallbackCategories;

  const categoriesMap = new Map();
  categoriesRaw.forEach((a) => {
    const k = (a.value || '').toLowerCase();
    if (!categoriesMap.has(k)) categoriesMap.set(k, a);
  });
  const categories = Array.from(categoriesMap.values());

  return (
    <div className={`${horizontal ? "flex flex-nowrap items-center gap-3 overflow-x-auto" : "grid grid-cols-2 md:grid-cols-4 gap-3"} ${className}`}>
      {categories.map((g) => {
        const isActive = activeC === g.value.toLowerCase();
        const label = getDisplay(g.name);
        return (
          <button
            key={`${g.value}-${g.name}`}
            onClick={() => router.push(`/all-products?c=${encodeURIComponent(g.value)}`)}
            className={`inline-flex items-center justify-center px-3 py-1.5 text-sm rounded-full border ${chipWidth} whitespace-nowrap truncate transition-colors ${isActive ? "bg-orange-50 border-orange-300 text-orange-700" : "bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300"}`}
            title={label}
            type="button"
          >
            {label}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryMenu;