'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { useProductForm } from '@/hooks/local/useProductForm';
import { productService } from '@/services/product.service';
import { ProductForm } from '@/components/admin/product-form/page';
import { toast } from 'react-hot-toast'; 

const EditProductPage = () => { 
    const router = useRouter();
    const { productId } = router.query;
    const { product, isLoading, error, fetchProduct } = useProductForm(productId);      
    useEffect(() => {
        fetchProduct();
    }, [productId, fetchProduct]);  
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productForm.validate()) {
            toast.error('Por favor completa todos los campos requeridos');
            return;
            }
        productForm.setIsSubmitting(true);  
        try {
            await productService.updateProduct(productForm.formData);
            toast.success('Producto actualizado con éxito');
            router.push('/admin/products');
        } catch (err) {
            toast.error('Error al actualizar el producto');
        } finally {
            productForm.setIsSubmitting(false);
        }
    };  
    const handleCancel = () => {
        router.back();
    };  
    if (isLoading) {
        return <div>Cargando...</div>;
    }   
    if (error) {
        return <div>Error: {error.message}</div>;
    } 
    if (!product) {
        return <div>Producto no encontrado</div>;
    }   
    return (
        <div className="flex-1 min-h-screen bg-gray-50">
            <div className="md:p-10 p-4 max-w-5xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Editar Producto
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
export default EditProductPage;