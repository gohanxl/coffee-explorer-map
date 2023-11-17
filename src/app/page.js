"use client";
import React from "react";
import { CoffeeShopMap } from "../../components/Home/CoffeeShopMap";
import { coffeeShopsData } from "../../coffee-shops.constant";

export default function Home() {
  return (
    <div>
      <CoffeeShopMap coffeeShopsData={coffeeShopsData} />
    </div>
  );
}
