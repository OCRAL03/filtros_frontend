'use client';
import React from 'react';
import { Package } from 'lucide-react';
import { BRANDS, CATEGORIES } from '@/utils/constants';

export const BasicInfoSection = ({
  formData,
  errors,
  updateField,
}) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-5">
        <Package className="text-blue-600" size={24} />
        <h2 className="text-xl font-semibold text-gray-900">Información Básica</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Nombre del Producto */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder='Ej: Smart TV LED 55" 4K Ultra HD'
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.nombre ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.nombre}
            onChange={(e) => updateField('nombre', e.target.value)}
          />
          {errors?.nombre && (
            <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
          )}
        </div>

        {/* Marca */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Marca<span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.marca ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.marca}
            onChange={(e) => updateField('marca', e.target.value)}
          >
            <option value="">Seleccionar marca</option>
            {BRANDS.map((marca) => (
              <option key={marca} value={marca}>
                {marca}
              </option>
            ))}
          </select>
          {errors?.marca && (
            <p className="text-red-500 text-sm mt-1">{errors.marca}</p>
          )}
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.categoria ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.categoria}
            onChange={(e) => updateField('categoria', e.target.value)}
          >
            <option value="">Seleccionar categoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors?.categoria && (
            <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
          )}
        </div>

        {/* Sub Categoría */} 
        <div> 
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sub Categoría <span className="text-red-500">*</span>
          </label>  
          <select
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.subcategoria ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.subcategoria}
            onChange={(e) => updateField('subcategoria', e.target.value)}
          >
            <option value="">Seleccionar subcategoría</option>
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nombre}
              </option>
            ))}
          </select>
          {errors?.subcategoria && (
            <p className="text-red-500 text-sm mt-1">{errors.subcategoria}</p>
          )}
        </div>

        {/* Tipo de Producto */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo de Producto <span className="text-red-500">*</span>
          </label>
          <select
            className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none ${
              errors?.tipo_producto ? 'border-red-500' : 'border-gray-300'
            }`}
            value={formData.tipo_producto}
            onChange={(e) => updateField('tipo_producto', e.target.value)}
          >
            <option value="">Seleccionar tipo de producto</option>
            <option value="1">Producto Físico</option>
            <option value="2">Servicio</option>
          </select>
          {errors?.tipo_producto && (
            <p className="text-red-500 text-sm mt-1">{errors.tipo_producto}</p>
          )}
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            rows="4"
            placeholder="Descripción detallada del producto..."
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            value={formData.descripcion}
            onChange={(e) => updateField('descripcion', e.target.value)}
          />
        </div>

        {/* Imagen Principal*/}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Imagen Principal <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => updateField('imagen_principal', e.target.files[0])}
          />
        </div>
      </div>
    </div>
  );
};