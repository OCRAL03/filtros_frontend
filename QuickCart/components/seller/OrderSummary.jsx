import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);
  const [showOrderSent, setShowOrderSent] = useState(false);
  const [showUrgentMessage, setShowUrgentMessage] = useState(false);

  const fetchUserAddresses = async () => {
    setUserAddresses([]);
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const createOrder = async () => {
    setShowOrderSent(true);
    setShowUrgentMessage(false);

    setTimeout(() => {
      setShowOrderSent(false);
      setShowUrgentMessage(true);
      setTimeout(() => setShowUrgentMessage(false), 60000);
    }, 2000);
  }

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5 relative">
      {showOrderSent && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white border border-orange-300 text-orange-800 rounded-md px-6 py-4 shadow-md">
            Orden enviada
          </div>
        </div>
      )}

      {showUrgentMessage && (
        <div
          className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-orange-100 border border-orange-300 text-orange-800 rounded-md px-6 py-3 shadow cursor-pointer z-50"
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('https://wa.me/51930162054', '_blank');
            }
          }}
        >
          ¿Pedido urgente? Llama al 914218559
        </div>
      )}

      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Resumen del pedido
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Seleccionar dirección
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Seleccionar dirección"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer"
                    onClick={() => handleAddressSelect(address)}
                  >
                    {address.fullName}, {address.area}, {address.city}, {address.state}
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Agregar nueva dirección
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Código promocional
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Ingresa el código promocional"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-600 text-white px-9 py-2 hover:bg-orange-700">
              Aplicar
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Artículos {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Costo de envío</p>
            <p className="font-medium text-gray-800">Gratis</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-600 text-white py-3 mt-5 hover:bg-orange-700">
        Realizar pedido
      </button>
    </div>
  );
};

export default OrderSummary;