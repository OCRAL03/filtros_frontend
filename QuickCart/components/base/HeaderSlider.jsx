import React, { useState, useEffect } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";

const HeaderSlider = () => {
  const { router } = useAppContext();
  const sliderData = [
    {
      id: 1,
      title: "Potencia en cada píxel — laptops para todo",
      offer: "Ofertas en laptops seleccionadas",
      buttonText1: "Comprar ahora",
      buttonText2: "Ver más",
      imgSrc: "/assets/productos/2APUQY1333W.jfif",
      link1: "/all-products?c=Tecnolog%C3%ADa&s=Computaci%C3%B3n&t=Laptops",
      link2: "/all-products?c=Tecnolog%C3%ADa&s=Computaci%C3%B3n&t=Laptops",
    },
    {
      id: 2,
      title: "Sonido potente — bocinas y parlantes al mejor precio",
      offer: "Aprovecha descuentos en audio",
      buttonText1: "Comprar ahora",
      buttonText2: "Ver ofertas",
      imgSrc: "/assets/productos/AWSN%2015-2.jpeg",
      link1: "/all-products?c=Tecnolog%C3%ADa&s=Audio&t=Parlantes",
      link2: "/all-products?c=Tecnolog%C3%ADa&s=Audio&t=Parlantes",
    },
    {
      id: 3,
      title: "Frigobar 90L — compacto y eficiente",
      offer: "Aprovecha ofertas en frigobares",
      buttonText1: "Comprar ahora",
      buttonText2: "Ver frigobares",
      imgSrc: "/assets/productos/RR121H.jfif",
      link2: "/all-products?c=Hogar%20y%20electrohogar&s=Refrigeradoras&t=Frigobar",
      link1: "/all-products?c=Hogar%20y%20electrohogar&s=Refrigeradoras&t=Frigobar",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sliderData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [sliderData.length]);

  const handleSlideChange = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="overflow-hidden relative w-full">
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentSlide * 100}%)`,
        }}
      >
        {sliderData.map((slide, index) => (
          <div
            key={slide.id}
            className="flex flex-col-reverse md:flex-row items-center justify-between bg-[#E6E9F2] py-8 md:px-14 px-5 mt-6 rounded-xl min-w-full"
          >
            <div className="md:pl-8 mt-10 md:mt-0">
              <p className="md:text-base text-orange-600 pb-1">{slide.offer}</p>
              <h1 className="max-w-lg md:text-[40px] md:leading-[48px] text-2xl font-semibold">
                {slide.title}
              </h1>
              <div className="flex items-center mt-4 md:mt-6 ">
                <button className="md:px-10 px-7 md:py-2.5 py-2 bg-orange-600 rounded-full text-white font-medium" onClick={() => { if (sliderData[currentSlide]?.link1) router.push(sliderData[currentSlide].link1); }}>
                  {slide.buttonText1}
                </button>
                <button className="group flex items-center gap-2 px-6 py-2.5 font-medium" onClick={() => { if (slide.link2) router.push(slide.link2); }}>
                  {slide.buttonText2}
                  <Image className="group-hover:translate-x-1 transition" src={assets.arrow_icon} alt="arrow_icon" />
                </button>
              </div>
            </div>
            <div className="flex items-center flex-1 justify-center">
              <img
                className="md:w-72 w-48"
                src={slide.imgSrc}
                alt={`Slide ${index + 1}`}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 mt-8">
        {sliderData.map((_, index) => (
          <div
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`h-2 w-2 rounded-full cursor-pointer ${
              currentSlide === index ? "bg-orange-600" : "bg-gray-500/30"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default HeaderSlider;
