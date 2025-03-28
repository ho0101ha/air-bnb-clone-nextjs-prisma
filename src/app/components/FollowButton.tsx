
// "use client";
// import axios from "axios";
// import React, { useState } from "react";

// interface FollowButtonProps {
//   ownerId: number; // フォロー対象のユーザーID
//   isFollowed: boolean; // 初期のフォロー状態
//   initialFollowerCount: number; // 初期のフォロワー数
// }

// export default function FollowButton({ ownerId, isFollowed, initialFollowerCount }: FollowButtonProps) {
//   const [followed, setFollowed] = useState(isFollowed);
//   const [followerCount, setFollowerCount] = useState(initialFollowerCount);

//   const toggleFollow = async () => {
//     try {
//       const response = await axios.post("/api/follow", { ownerId });
//       if (response.status === 200) {
//         setFollowed((prev) => !prev);
//         setFollowerCount((prev) => (followed ? prev - 1 : prev + 1));
//       }
//     } catch (error) {
//       console.error("エラー:", error);
//     }
//   };

//   return (
//     <div>
//       <button onClick={toggleFollow}>
//         {followed ? "フォロー中" : "フォロー"} ({followerCount})
//       </button>
//     </div>
//   );
// }
"use client";
import React from "react";

interface FollowButtonProps {
  ownerId: number;
  isFollowed: boolean;
  followerCount: number;
  onFollowToggle: (ownerId: number) => void; // フォロー状態を更新する関数
}

export default function FollowButton({ ownerId, isFollowed, followerCount, onFollowToggle }: FollowButtonProps) {
  return (
    <div>
       <button onClick={() => onFollowToggle(ownerId)} className="bg-red-400 text-white p-3">
      {isFollowed ? "フォロー中" : "フォロー"} ({followerCount})
    </button>
    </div>
   
  );
}