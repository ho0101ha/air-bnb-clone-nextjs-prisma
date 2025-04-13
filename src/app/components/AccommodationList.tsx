"use client";
import Link from "next/link";
import React, { useState,  } from "react";
import axios from "axios";
import LikeButton from "./LikeButton";
import FollowButton from "./FollowButton";

interface Accommodation {
  id: number;
  name: string;
  description: string;
  price: number;
  location: string;
  locationJP: string;
  imageUrl: string;
  createdAt: Date;
  ownerId: number;
}

interface Props {
  accommodations: Accommodation[];
  initialFavorites: number[];
  likedAccommodations: number[]; 
  likesCountMap: Record<number, number>;
  initialFollowedUsers: number[];
  followersCountMap: Record<number, number>;
  
}

export default function AccommodationList({
  accommodations,
  initialFavorites,
  likedAccommodations,
  likesCountMap,
  initialFollowedUsers,
  followersCountMap,
  
}: Props) {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>(initialFavorites);
  const filters = ["モダン", "ビーチ", "雪景色"];
  const [searchText,setSearchText] = useState<string>("");
  const [followedUsers, setFollowedUsers] = useState<Set<number>>(new Set(initialFollowedUsers));
  const [followersCount, setFollowersCount] = useState<Record<number, number>>(followersCountMap);


  

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
    } catch (error) {
      console.error("Error updating favorite:", error);
    }
  };


  const toggleFollow = async (ownerId: number) => {
    try {
      const response = await axios.post("/api/follow", { ownerId });
      if (response.status === 200) {
        setFollowedUsers((prev) => {
          const newFollowedUsers = new Set(prev);
          if (newFollowedUsers.has(ownerId)) {
            newFollowedUsers.delete(ownerId);
         
          } else {
            newFollowedUsers.add(ownerId);
          
          }
          return newFollowedUsers;
        });

        setFollowersCount((prev) => ({
          ...prev,
          [ownerId]: prev[ownerId] ? prev[ownerId] + (prev[ownerId] > 0 ? -1 : 1) : 1,
        
        }));
      }
     
    } catch (error) {
      console.error("フォローの切り替えに失敗しました", error);
    }
  };


  
  const filteredAccommodations = selectedFilter
  ? accommodations.filter((item) => item.description.includes(selectedFilter))
  : accommodations;

  const groupedByOwner = filteredAccommodations.reduce<Record<number, Accommodation[]>>((acc, item) => {
    if (!acc[item.ownerId]) {
      acc[item.ownerId] = [];
    }
    acc[item.ownerId].push(item);
    return acc;
  }, {});

  return (
    <div>
    {/* フィルター UI */}
    <div className="mb-4 w-max mx-auto">
      <h2 className="text-lg font-semibold mb-7 text-center">
        様々なシーンの宿泊施設を演出します。
      </h2>
      <div className="flex justify-between">
      <ul className="list-none p-0 flex justify-center">
        {filters.map((filter) => (
          <li
            key={filter}
            className={`cursor-pointer p-3 rounded-md ${
              selectedFilter === filter ? "bg-red-500 text-white" : "hover:bg-gray-200"
            }`}
            onClick={() => setSelectedFilter(filter)}
          >
            {filter}
          </li>
        ))}
        <li
          className={`cursor-pointer p-2 rounded-md ${
            selectedFilter === null ? "bg-red-500 text-white" : "hover:bg-gray-200"
          }`}
          onClick={() => setSelectedFilter(null)}
        >
          すべて表示
        </li>
      </ul>
      <div className="flex ml-20">
        <form className="flex"
         onSubmit={(e) => {
          e.preventDefault();
          setSelectedFilter(searchText); // 検索語句をフィルターとして設定
        }}>
        <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
        className=" block rounded-sm  bg-gray-200"/>
        <button type="submit" className="ml-1 rounded-md border text-white bg-red-500  p-2 hover:opacity-50">検索</button>
        </form>
        </div>
      </div>
     
    </div>

    {/* 宿泊施設（オーナーごとに表示） */}
    <div className="w-full mb-5 space-y-8">
      {Object.entries(groupedByOwner).map(([ownerId, ownerAccommodations]) => (
        <div key={ownerId} className="border rounded-lg p-4 shadow-md">
          {/* オーナーのフォローボタン */}
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">所有者番号 {ownerId}</h3>
            <FollowButton
              ownerId={Number(ownerId)}
              isFollowed={followedUsers.has(Number(ownerId))}
              followerCount={followersCount[Number(ownerId)] || 0}
              onFollowToggle={toggleFollow}
            />
          </div>

          {/* 宿泊施設リスト */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ownerAccommodations.map((accommodation) => (
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
                  <button onClick={() => toggleFavorite(accommodation.id)} className="text-2xl">
                    {favorites.includes(accommodation.id) ? "⭐" : "☆"}
                  </button>
                </div>

                {/* いいねボタン */}
                <LikeButton
                  accommodationId={accommodation.id}
                  isLiked={likedAccommodations.includes(accommodation.id)}
                  initialCount={likesCountMap[accommodation.id] || 0}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
   
  );
}
