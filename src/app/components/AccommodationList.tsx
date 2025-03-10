"use client";
import Link from "next/link";
import React, { useState,  } from "react";
import axios from "axios";
import LikeButton from "./ LikeButton";

interface Accommodation {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  locationJP: string;
  imageUrl: string;
}

interface Props {
  accommodations: Accommodation[];
  initialFavorites: number[];
  likedAccommodations: number[]; 
  likesCountMap: Record<number, number>;
}

export default function AccommodationList({
  accommodations,
  initialFavorites,
  likedAccommodations,
  likesCountMap,
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);
  const filters = ["モダン", "ビーチ", "雪景色"];

  // サーバーから最新のお気に入り状態を取得
  const fetchFavorites = async () => {
    try {
      const response = await axios.get("/api/favorites");
      if (response.status === 200) {
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  };
  

  const toggleFavorite = async (id: number) => {
    try {
      const response = await axios.post("/api/favorites", { accommodationId: id });
      if (response.status === 200) {
        // サーバーからお気に入り状態を再取得
        await fetchFavorites();
      } else {
        console.error("Failed to update favorite");
      }
    } catch (error: any) {
      console.error("Error updating favorite:", error.response?.data || error);
    }
  };

  const filteredAccommodations = selectedFilter
    ? accommodations.filter((item) => item.description.includes(selectedFilter))
    : accommodations;
     
    
  return (
    <div>
      {/* フィルター UI */}
      <div className="mb-4 w-max mx-auto">
        <h2 className="text-lg font-semibold mb-7 text-center">
          様々なシーンの宿泊施設を演出します。
        </h2>
        <ul className="list-none p-0 flex justify-center">
          {filters.map((filter) => (
            <li
              key={filter}
              className={`cursor-pointer p-3 rounded-md ${
                selectedFilter === filter
                  ? "bg-red-500 text-white"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedFilter(filter)}
            >
              {filter}
            </li>
          ))}
          <li
            className={`cursor-pointer p-2 rounded-md ${
              selectedFilter === null
                ? "bg-red-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter(null)}
          >
            すべて表示
          </li>
        </ul>
      </div>

      {/* 宿泊施設表示 */}
      <div className={`${filteredAccommodations.length ===1 ? "flex justify-center" :"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}  w-full  mb-5`}>
        {filteredAccommodations.map((accommodation) => (
          <div
            key={accommodation.id}
            className="cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg"
          >
            <img
              src={accommodation.imageUrl}
              alt={accommodation.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="text-lg font-semibold">{accommodation.name}</h3>
            <p>{accommodation.description}</p>
            <p className="text-sm text-gray-600">{accommodation.locationJP}</p>
            <p className="text-lg font-bold">¥{accommodation.price}/泊</p>
            <div className="flex justify-between items-center mt-4">
              <Link
                href={`accommodation/${accommodation.id}`}
                className="rounded-md border border-black p-2 hover:bg-red-500 hover:text-white"
              >
                more
              </Link>
              {/* お気に入りボタン */}
              <button
                onClick={() => toggleFavorite(accommodation.id)}
                className="text-2xl"
              >
                {favorites.includes(accommodation.id) ? "⭐" : "☆"}
              </button>
            </div>
            {/* {いいね} */}
            <LikeButton
            accommodationId={accommodation.id}
            isLiked={likedAccommodations.includes(accommodation.id)}
            initialCount={likesCountMap[accommodation.id] || 0}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
