// components/ProLoader.js
import React from "react";

const Loader = ({ size = "md", color = "primary" }) => {
  return (
    <div className={`fixed top-0 left-0 w-full h-full flex items-center justify-center 
      bg-black bg-opacity-70 z-50`}>
      <div className={`flex flex-col items-center`}>
        {/* Animated Spinner */}
        <div className={`relative rounded-full animate-spin ${getSizeClasses(size)}`}>
          <div className={`absolute inset-0 rounded-full border-4 border-t-${color}-500 
            border-b-transparent border-l-${color}-500 border-r-transparent`}></div>
          <div className={`absolute inset-0 rounded-full border-4 border-l-${color}-500 
            border-t-transparent border-r-${color}-500 border-b-transparent 
            animate-spin-loading`}></div>
        </div>

        {/* Loading Text */}
        <div className={`text-center mt-4 text-${color}-500 text-sm animate-fadeIn`}>
          Loading...
        </div>
      </div>
    </div>
  );
};

const getSizeClasses = (size) => {
  switch (size) {
    case "sm":
      return "w-16 h-16";
    case "lg":
      return "w-40 h-40";
    default:
      return "w-28 h-28";
  }
};

export default Loader;