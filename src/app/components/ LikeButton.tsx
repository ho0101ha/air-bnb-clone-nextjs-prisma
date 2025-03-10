"use client";
import axios from 'axios';
import React, { useState } from 'react';

interface LikeButtonProps {
  accommodationId: number;
  isLiked: boolean;
  initialCount: number;
}
export default function  LikeButton({accommodationId,isLiked,initialCount}:LikeButtonProps) {
    const [liked,setLiked] = useState(isLiked);
    const [likeCount,setLikeCount] = useState(initialCount);
    const toggleLike = async() =>{
      try {
        const response = await axios.post("/api/like",{accommodationId});
        if(response.status === 200){
          setLiked(prev => !prev); 
          setLikeCount( (prev) => (liked? prev - 1 :  prev + 1));
        }
       
      } catch (error) {
        console.error("エラー:", error);
      }
     
    }
  return (
    <div>
      <div>
        <button onClick={toggleLike}>{liked? "❤️" : "🤍"}{likeCount}</button>
      </div>
    </div>
  )
}
