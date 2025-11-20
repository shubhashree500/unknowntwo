

"use client";

import React, { useEffect, useState } from "react";
import { assetwallpaper1 } from "@/src/assets";
import baseUrl from "@/config/baseurl";
import axios from "axios";

export default function Dashboard() {
  const [data, setData] = useState<any>([]);
  const [assets, setAssets] = useState<any>([]);

  // Fetching data for assets
  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const response = await axios.get(`${baseUrl}/asset/get`);
        setData(response.data.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };

    fetchAssets();
  }, []);

  // Fetching additional data
  useEffect(() => {
    const handleFetchAssets = async () => {
      try {
        const response = await axios.get(`${baseUrl}/tbassettype/get`);
        setAssets(response.data);
      } catch (error) {
        console.error("Error fetching assets:", error);
      }
    };
    handleFetchAssets();
  }, []);

  // Filtering available data by category 
  const availableData = (category: any) =>
    assets.filter((item: any) => item.category?.toLowerCase() === category?.toLowerCase());

  const countCategory = (assetType: any) =>
    data.filter((item: any) => item.assetType?.toLowerCase() === assetType?.toLowerCase());

  return (
    <div>
      <div
        className="w-auto h-screen bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${assetwallpaper1.src})`,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 main-container p-8">
          {/* Electronics Box */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-[#5A12CF] font-bold text-2xl mb-2">Electronics</h2>
              <p className="text-gray-700 text-lg font-medium">{countCategory("Electronics").length}</p>
            </div>
            <div className="absolute top-0 right-0 p-4">
              <span className="h-10 w-10 bg-white rounded-full p-2 shadow-lg center">
                <p>{countCategory("Electronics").length - availableData("electronics").length}</p>
              </span>
            </div>
          </div>

          {/* Furniture Box */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-[#5A12CF] font-bold text-2xl mb-2">Furniture</h2>
              <p className="text-gray-700 text-lg font-medium">{countCategory("Furniture").length}</p>
            </div>
            <div className="absolute top-0 right-0 p-4">
              <span className="h-10 w-10 bg-white rounded-full p-2 shadow-lg center">
                <p>{countCategory("Furniture").length - availableData("furniture").length}</p>
              </span>
            </div>
          </div>

          {/* Vehicles Box */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-[#5A12CF] font-bold text-2xl mb-2">Vehicles</h2>
              <p className="text-gray-700 text-lg font-medium">{countCategory("Vehicle").length}</p>
            </div>
            <div className="absolute top-0 right-0 p-4">
              <span className="h-10 w-10 bg-white rounded-full p-2 shadow-lg center">
                <p>{countCategory("Vehicle").length - availableData("vehicle").length}</p>
              </span>
            </div>
          </div>

          {/* Uniform Box */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-[#5A12CF] font-bold text-2xl mb-2">Uniform</h2>
              <p className="text-gray-700 text-lg font-medium">{countCategory("Uniform").length}</p>
            </div>
            <div className="absolute top-0 right-0 p-4">
              <span className="h-10 w-10 bg-white rounded-full p-2 shadow-lg center">
                <p>{countCategory("Uniform").length - availableData("uniform").length}</p>
              </span>
            </div>
          </div>

          {/* Others Box */}
          <div className="relative bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 p-6 rounded-3xl shadow-xl transition-transform transform hover:scale-105 hover:shadow-2xl">
            <div className="bg-white rounded-2xl p-4">
              <h2 className="text-[#5A12CF] font-bold text-2xl mb-2">Others</h2>
              <p className="text-gray-700 text-lg font-medium">{countCategory("Others").length}</p>
            </div>
            <div className="absolute top-0 right-0 p-4">
              <span className="h-10 w-10 bg-white rounded-full p-2 shadow-lg center">
                <p>{countCategory("Others").length - availableData("others").length}</p>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



