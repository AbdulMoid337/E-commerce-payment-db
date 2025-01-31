// pages/404.js

import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-gray-800">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-6xl font-bold text-red-500">404</h1>
        <h2 className="text-2xl mt-2 text-gray-700">Page Not Found</h2>
        <p className="mt-4 text-gray-500">Sorry, the page you're looking for doesn't exist.</p>
        <Link href="/">
          <h1 className="mt-6 inline-block text-blue-500 hover:underline">Go back to Home</h1>
        </Link>
      </div>
    </div>
  );
}
