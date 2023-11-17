import React, { useMemo, useRef, useState } from "react";
import {
  GoogleMap,
  LoadScript,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";

const mapContainerStyle = {
  height: "100vh",
  width: "100%",
};

const center = {
  lat: -34.6037,
  lng: -58.3816,
};

export const CoffeeShopMap = ({ coffeeShopsData }) => {
  const mapRef = useRef(null);
  const [filteredShops, setFilteredShops] = useState(coffeeShopsData);
  const [selectedShop, setSelectedShop] = useState(null);

  const handleMapLoad = () => {
    if (mapRef.current && coffeeShopsData.length > 0 && window.google) {
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
      const center = bounds.getCenter();
      mapRef.current.setCenter(center);
    }
  };

  const handleFilter = (filter) => {
    const filtered = coffeeShopsData.filter((shop) => {
      return shop.brewingMethods.includes(filter);
    });

    setFilteredShops(filtered);
  };

  const handleMarkerClick = (shop) => {
    setSelectedShop(shop);
  };

  const handleInfoWindowClose = () => {
    setSelectedShop(null);
  };

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY}>
      {/* Filter Buttons */}
      <div className="absolute top-4 left-4 flex space-x-2 z-10">
        <button
          onClick={() => handleFilter("Espresso")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
        >
          Espresso
        </button>
        <button
          onClick={() => handleFilter("Pour-Over")}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
        >
          Pour-Over
        </button>
      </div>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={handleMapLoad}
      >
        {/* Markers */}
        {filteredShops.map((shop, index) => (
          <MarkerF
            key={index}
            position={{
              lat: shop.coordinates.latitude,
              lng: shop.coordinates.longitude,
            }}
            title={shop.markerTitle}
            onClick={() => handleMarkerClick(shop)}
          />
        ))}
        {/* InfoWindow */}
        {selectedShop && (
          <InfoWindowF
            position={{
              lat: selectedShop.coordinates.latitude,
              lng: selectedShop.coordinates.longitude,
            }}
            onCloseClick={handleInfoWindowClose}
          >
            <div style={{ color: "black" }}>
              <h2>{selectedShop.name}</h2>
              <p>{selectedShop.markerDescription}</p>
            </div>
          </InfoWindowF>
        )}
      </GoogleMap>
    </LoadScript>
  );
};
