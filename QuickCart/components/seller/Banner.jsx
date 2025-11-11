"use client"
import React from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const Banner = () => {
  const { router } = useAppContext();
  return (
    <div className="flex flex-col md:flex-row items-center justify-between md:pl-20 py-14 md:py-0 bg-[#E6E9F2] my-16 rounded-xl overflow-hidden">
      <Image
        className="max-w-56 h-auto"
        src={assets.jbl_soundbox_image}
        alt="audio_banner"
        width={1280}
        height={720}
      />
      <div className="flex flex-col items-center justify-center text-center space-y-2 px-4 md:px-0">
        <h2 className="text-2xl md:text-3xl font-semibold max-w-[290px]">
          Potencia tu experiencia de juego
        </h2>
        <p className="max-w-[343px] font-medium text-gray-800/60">
          Desde sonido inmersivo hasta controles precisos: todo para ganar
        </p>
        <button
          onClick={() => router.push('/all-products?c=Tecnología&s=Computación&t=Laptops')}
          className="group flex items-center justify-center gap-1 px-12 py-2.5 bg-orange-600 rounded text-white"
        >
          Comprar ahora
          <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon_white} alt="arrow_icon_white" />
        </button>
      </div>
      <Image
        className="hidden md:block max-w-80 h-auto"
        src={assets.asus_laptop_image}
        alt="laptop_banner"
        width={1280}
        height={720}
      />
      <Image
        className="md:hidden h-auto"
        src={assets.asus_laptop_image}
        alt="laptop_banner_mobile"
        width={1280}
        height={720}
      />

    </div>
  );
};

export default Banner;