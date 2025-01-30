"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

const Search = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [rating, setRating] = useState("");

  const handleSearch = () => {
    console.log("Search Query: ", searchQuery);
    console.log("Selected Category: ", selectedCategory);
    console.log("Price Range: ", priceRange);
    console.log("Rating: ", rating);
  };

  return (
    <div className="flex pt-20 flex-col md:flex-row items-start justify-start p-4 space-y-4 md:space-y-0">
      {/* Search Input */}
      <div className="w-full md:w-2/3 flex flex-col md:flex-row items-start md:items-center space-y-2 md:space-y-0 md:space-x-4 mr-4">
        <input
          className="w-full p-4 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          onClick={handleSearch}
          className="w-full md:w-auto px-6 py-2 m-0 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          Search
        </Button>
      </div>

      {/* Filters Section */}
      <div className="flex flex-wrap items-center justify-start  space-x-4 mt-8 md:mt-0">
        {/* Category Filter (ShadCN Dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {selectedCategory || "Category"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 bg-white shadow-lg rounded-md">
            <DropdownMenuItem onClick={() => setSelectedCategory("electronics")}>
              Electronics
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory("fashion")}>
              Fashion
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory("home")}>
              Home
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory("beauty")}>
              Beauty
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSelectedCategory("sports")}>
              Sports
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Price Range Filter (ShadCN Dropdown) */}
        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            {priceRange || "Price Range"}
          </DropdownMenuTrigger>
          <DropdownMenuContent className="p-2 bg-white shadow-lg rounded-md">
            <DropdownMenuItem onClick={() => setPriceRange("0-50")}>
              $0 - $50
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriceRange("51-100")}>
              $51 - $100
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriceRange("101-200")}>
              $101 - $200
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setPriceRange("200+")}>
              $200+
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Search;
