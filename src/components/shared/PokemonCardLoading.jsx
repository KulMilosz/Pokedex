import React from "react";

const PokemonCardLoading = ({ className = "" }) => {
  return (
    <div
      className={`w-full max-w-[400px] max-h-[500px] mx-auto rounded-lg bg-gray-100 dark:bg-gray-400 shadow-xl m-5 overflow-hidden animate-pulse pulse-sync ${className}`}
    >
      <div className="w-full h-80 flex items-center justify-center bg-gray-200">
        <div className="w-32 h-32 bg-gray-300 rounded-full" />
      </div>
      <div className="p-4 space-y-4">
        <div className="h-6 bg-gray-300 rounded w-1/2 mx-auto" />
        <div className="grid grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="text-center space-y-2">
              <div className="h-4 bg-gray-300 rounded w-10 mx-auto" />
              <div className="h-3 bg-gray-200 rounded w-16 mx-auto" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PokemonCardLoading;
