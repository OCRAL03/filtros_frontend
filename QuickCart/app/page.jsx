'use client'
import React from "react";
import HeaderSlider from "@/components/base/HeaderSlider";
import HomeProducts from "@/components/HomeProducts";
import NewsLetter from "@/components/seller/NewsLetter";
import Navbar from "@/components/Navbar";
import Footer from "@/components/base/FooterIcons";
import CategoryMenu from "@/components/filters/CategoryMenu";

const Home = () => {
  return (
    <>
      <Navbar/>
      <div className="px-6 md:px-16 lg:px-32">
        <HeaderSlider />
        
        {/* Filtros de categorías */}
        <div className="-mx-6 md:-mx-16 lg:-mx-32 px-2 sm:px-3 md:px-4 py-3">
          <div className="flex flex-nowrap items-center gap-3 overflow-x-auto scrollbar-hide pb-2 w-full" role="navigation" aria-label="Filtro de categorías">
            <CategoryMenu horizontal chipWidth="w-36" className="w-full" />
          </div>
        </div>
        
        <HomeProducts />
        {/* Banner eliminado temporalmente para evitar errores de imagen */}
        <NewsLetter />
      </div>
      <Footer />
    </>
  );
};

export default Home;
