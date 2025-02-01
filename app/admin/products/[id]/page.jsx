"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Save, X } from 'lucide-react';
import products from '@/data/products';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = parseInt(params.id);

  const [product, setProduct] = useState({
    id: '',
    name: '',
    description: '',
    category: '',
    price: '',
    rating: '',
    imageUrl: ''
  });

  useEffect(() => {
    // Find the product by ID
    const foundProduct = products.find(p => p.id === productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      router.push('/admin/products');
    }
  }, [productId, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'rating' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Find the index of the product to update
    const productIndex = products.findIndex(p => p.id === productId);
    
    if (productIndex !== -1) {
      // Update the product in the array
      products[productIndex] = product;
      
      // Here you would typically send this to a backend API
      // For now, we'll just log and redirect
      console.log('Updated Product:', product);
      
      // Redirect back to products list
      router.push('/admin/page');
    }
  };

  const handleCancel = () => {
    router.push('/admin/page');
  };

  return (
    <div className="container mx-auto pt-48 pb-36 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Package className="mr-3 text-blue-500" /> Edit Product
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
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={handleCancel}
              className="flex items-center"
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button 
              type="submit" 
              className="flex items-center"
            >
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
