"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Save, X } from 'lucide-react';
import products from '@/data/products'; // Keep for initial data or fallback
import Loader from '@/components/Loader';
import { toast } from 'sonner'; // Add toast for notifications

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id === 'new' ? null : params.id;

  const [product, setProduct] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    rating: 1,
    imageUrl: '',
    stock: 0
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Add the missing handleInputChange function
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' || name === 'stock' 
        ? parseFloat(value) 
        : value
    }));
  };

  // In the useEffect function where you fetch the product
  useEffect(() => {
    const fetchProduct = async () => {
      // If editing an existing product
      if (productId && productId !== 'new') {
        try {
          setIsLoading(true);
          const response = await fetch(`/api/products/${productId}`);
          if (response.ok) {
            const data = await response.json();
            setProduct({
              ...data,
              imageUrl: data.images?.[0] || ''
            });
          } else {
            toast.error("Failed to load product");
            router.push('/admin/products');
          }
        } catch (error) {
          console.error("Error fetching product:", error);
          toast.error("Error loading product");
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };
  
    fetchProduct();
  }, [productId, router]);

  // In the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Prepare data for API
      const productData = {
        ...product,
        images: [product.imageUrl], // Convert imageUrl to images array for MongoDB schema
      };
      
      // API endpoint and method based on whether we're creating or updating
      const url = productId && productId !== 'new' 
        ? `/api/products/${productId}` 
        : '/api/products';
      
      const method = productId && productId !== 'new' ? 'PUT' : 'POST';
      
      console.log("Saving product with URL:", url, "Method:", method, "Data:", productData);
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });
      
      // Change this line in handleSubmit function
      if (response.ok) {
        toast.success(productId ? 'Product updated successfully' : 'Product added successfully');
        router.push('/admin/'); 
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save product');
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error('An error occurred while saving the product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/products');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto pt-40 pb-24 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Package className="mr-3 text-blue-500" /> 
          {productId && productId !== 'new' ? 'Edit Product' : 'Add New Product'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Input
                type="text"
                id="category"
                name="category"
                value={product.category}
                onChange={handleInputChange}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                type="number"
                id="price"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                step="0.01"
                required
                className="mt-1"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rating">Rating</Label>
              <Input
                type="number"
                id="rating"
                name="rating"
                value={product.rating}
                onChange={handleInputChange}
                step="0.1"
                min="0"
                max="5"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                type="number"
                id="stock"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                min="0"
                required
                className="mt-1"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={product.imageUrl}
              onChange={handleInputChange}
              required
              className="mt-1"
            />
            {product.imageUrl && (
              <div className="mt-2">
                <p className="text-sm text-gray-500 mb-1">Image Preview:</p>
                <img 
                  src={product.imageUrl} 
                  alt="Product preview" 
                  className="w-full max-h-48 object-contain border rounded-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '/placeholder-image.jpg'; // Fallback image
                    console.error('Error loading image:', product.imageUrl);
                  }}
                />
              </div>
            )}
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center"
              disabled={isSaving}
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex items-center"
              disabled={isSaving}
            >
              <Save className="mr-2 h-4 w-4" /> 
              {isSaving ? 'Saving...' : (productId && productId !== 'new' ? 'Save Changes' : 'Add Product')}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
