import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton
} from '@clerk/nextjs'

import Header from "../components/Header";
import Search from "../components/Search";
import products from "../data/products";

export default function Home() {
  return (
    <>
      <Header />
      <Search />
      {/* Product Grid */}
      <div className="container mx-auto px-6 lg:px-12 py-4 flex flex-col md:flex-row items-start justify-start p-4 space-y-4 md:space-y-0">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-full md:w-1/3 flex flex-col items-center justify-center p-4 border border-gray-300 rounded-md shadow-sm hover:shadow-md transition duration-200"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-64  object-cover rounded-md"
            />
            <h3 className="mt-4 text-xl font-semibold">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-blue-600 font-semibold">
              {product.price.toFixed(2)}
            </p>
            <button className="mt-4 w-full bg-blue-600 text-white font-semibold py-2 rounded-md hover:bg-blue-700 transition duration-200">
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
