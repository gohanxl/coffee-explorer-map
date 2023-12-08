import React, { useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
  MarkerClustererF,
} from "@react-google-maps/api";
import { FaFilter } from "react-icons/fa";
import { filterCategories } from "../../coffee-shops.constant";
import ReactModal from "react-modal";
import { FilterModal } from "./FilterModal";

const mapContainerStyle = {
  width: "100%",
  position: "relative", // Added position relative
  flex: 1,
};

const center = {
  lat: -34.6037,
  lng: -58.3816,
};

export const CoffeeShopMap = ({ coffeeShopsData }) => {
  const mapRef = useRef(null);
  const [activeFilters, setActiveFilters] = useState(new Set());
  const [selectedShop, setSelectedShop] = useState(null);
  const [filteredCafesCount, setFilteredCafesCount] = useState(0);

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const toggleModal = () => {
    setModalIsOpen((prev) => !prev);
  };

  const handleMapLoad = (map) => {
    mapRef.current = map;

    if (mapRef.current && coffeeShopsData.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      coffeeShopsData.forEach((shop) => {
        bounds.extend(
          new window.google.maps.LatLng(
            shop.coordinates.latitude,
            shop.coordinates.longitude
          )
        );
      });

      mapRef.current.fitBounds(bounds);
      const maxZoom = 15;
      mapRef.current.setZoom(Math.min(mapRef.current.getZoom(), maxZoom));
    }
  };

  const handleFilter = (filter) => {
    setActiveFilters((prevFilters) => {
      const updatedFilters = new Set(prevFilters);

      if (coffeeShopsData && coffeeShopsData.length > 0) {
        if (updatedFilters.has(filter)) {
          updatedFilters.delete(filter);
        } else {
          updatedFilters.add(filter);
        }
      }

      return updatedFilters;
    });

    setSelectedShop(null);
  };

  // const toggleMenu = (category) => {
  //   setOpenMenu((prevMenu) => (prevMenu === category ? null : category));
  // };

  const filteredCoffeeShops = coffeeShopsData.filter((shop) => {
    return [...activeFilters].every((activeFilter) => {
      return Object.entries(filterCategories).some(([category, filters]) => {
        const shopFeatures = shop[category];

        if (Array.isArray(shopFeatures)) {
          return shopFeatures.includes(activeFilter);
        }

        return activeFilter.toLowerCase() === shopFeatures.toLowerCase();
      });
    });
  });

  const resetFilters = () => {
    setActiveFilters(new Set());
    setFilteredCafesCount(coffeeShopsData.length);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      <div
        className="flex flex-col items-center p-4"
        style={{ height: "100vh", position: "relative" }}
      >
        {/* Filter Button */}
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            zIndex: "5",
          }}
        >
          <div
            className="relative bg-rose-200 rounded mb-4"
            style={{ width: "100%" }}
          >
            <div
              className="cursor-pointer flex items-center p-2"
              onClick={toggleModal}
            >
              <FaFilter size={24} color="#000" />
              <span className="ml-2 text-black">Filters</span>
            </div>
          </div>
        </div>

        {/* Google Map */}
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={12}
          onLoad={handleMapLoad}
          options={{ mapTypeControl: false }}
        >
          {/* Markers */}
          {filteredCoffeeShops.map((shop, index) => (
            <MarkerF
              key={index}
              position={{
                lat: shop.coordinates.latitude,
                lng: shop.coordinates.longitude,
              }}
              title={shop.markerTitle}
              onClick={() => setSelectedShop(shop)}
            />
          ))}
          {/* InfoWindow */}
          {selectedShop && (
            <InfoWindowF
              position={{
                lat: selectedShop.coordinates.latitude,
                lng: selectedShop.coordinates.longitude,
              }}
              onCloseClick={() => setSelectedShop(null)}
            >
              <div className="p-2 bg-white rounded">
                <h2 className="text-lg font-semibold text-black">
                  {selectedShop.name}
                </h2>
                <p className="text-black">{selectedShop.markerDescription}</p>
              </div>
            </InfoWindowF>
          )}
        </GoogleMap>

        {/* Filter Modal */}
        <ReactModal
          isOpen={modalIsOpen}
          onRequestClose={toggleModal}
          contentLabel="Filter Modal"
        >
          <FilterModal
            activeFilters={activeFilters}
            handleFilter={handleFilter}
            closeModal={toggleModal}
            resetFilters={resetFilters}
            filteredCafesCount={filteredCoffeeShops.length}
          />
        </ReactModal>
      </div>
    </LoadScript>
  );
};
