"use client"

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Package, Save, X } from 'lucide-react';
import products from '@/data/products';
import Loader from '@/components/Loader';

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id === 'new' ? null : parseInt(params.id);

  const [product, setProduct] = useState({
    id: productId || Date.now(),
    name: '',
    description: '',
    category: '',
    price: '',
    rating: '',
    imageUrl: ''
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Find the product by ID for editing
    if (productId) {
      const foundProduct = products.find(p => p.id === productId);
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        router.push('/products');
      }
    }
    setIsLoading(false);
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
    
    if (productId) {
      // Editing existing product
      const productIndex = products.findIndex(p => p.id === productId);
      
      if (productIndex !== -1) {
        products[productIndex] = product;
      }
    } else {
      // Adding new product
      products.push(product);
    }
    
    // Here you would typically send this to a backend API
    console.log(productId ? 'Updated Product:' : 'Added Product:', product);
    
    // Redirect back to products list
    router.push('/products');
  };

  const handleCancel = () => {
    router.push('/products');
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="container  mx-auto pt-40  pb-24 px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6 flex items-center">
          <Package className="mr-3 text-blue-500" /> 
          {productId ? 'Edit Product' : 'Add New Product'}
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
              <Save className="mr-2 h-4 w-4" /> 
              {productId ? 'Save Changes' : 'Add Product'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
