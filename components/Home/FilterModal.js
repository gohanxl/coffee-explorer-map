// FilterModal.js
import React from "react";
import { FaHeart } from "react-icons/fa";
import { categoriesNames, filterCategories } from "../../coffee-shops.constant";

export const FilterModal = ({
  activeFilters,
  handleFilter,
  resetFilters,
  closeModal,
  filteredCafesCount,
}) => {
  const categories = Object.keys(filterCategories);

  return (
    <div className="p-4">
      {/* Favorites and Open Cafes Section */}
      <div className="flex justify-between mb-4">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300`}
          onClick={() => handleFilter("Favorites")}
        >
          <FaHeart size={16} className="mr-2" />
          Favorites
        </button>
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300`}
          onClick={() => handleFilter("Open Cafes")}
        >
          Open Cafes
        </button>
      </div>

      {/* Categories and Filters */}
      {categories.map((category) => (
        <div key={category} className="mb-4">
          <h3 className="text-lg text-black font-semibold">
            {categoriesNames[category]}
          </h3>
          <div className="flex flex-wrap">
            {filterCategories[category].map((filter) => (
              <button
                key={filter}
                className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 mb-2 hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300 ${
                  activeFilters.has(filter) ? "bg-blue-700" : ""
                }`}
                onClick={() => handleFilter(filter, category)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Reset and Show X Cafes Buttons */}
      <div className="flex justify-between mt-4">
        <button
          className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring focus:border-red-300`}
          onClick={resetFilters}
        >
          Reset All Filters
        </button>
        <button
          className={`bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 focus:outline-none focus:ring focus:border-green-300`}
          onClick={closeModal}
        >
          {`Show ${filteredCafesCount} Cafes`}
        </button>
      </div>
    </div>
  );
};
