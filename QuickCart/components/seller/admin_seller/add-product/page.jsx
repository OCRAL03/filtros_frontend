'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useProductForm } from '@/hooks/local/useProductForm';
import { productService } from '@/services/product.service';
import { ProductForm } from '@/components/admin/product-form/page';
import { toast } from 'react-hot-toast'; 

const AddProductPage = () => {
  const router = useRouter();
  const productForm = useProductForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!productForm.validate()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    productForm.setIsSubmitting(true);

    try {
      await productService.createProduct(productForm.formData);
      toast.success('Producto creado exitosamente');
      productForm.resetForm();
      router.push('/admin/products');
    } catch (error) {
      toast.error(error.message || 'Error al crear el producto');
    } finally {
      productForm.setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="flex-1 min-h-screen bg-gray-50">
      <div className="md:p-10 p-4 max-w-5xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Agregar nuevo Producto
          </h1>
          <p className="text-gray-600 mt-1">
            Complete todos los campos requeridos
          </p>
        </div>

        <ProductForm
          {...productForm}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
};

export default AddProductPage;