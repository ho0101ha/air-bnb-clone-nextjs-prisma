"use client";
import axios from 'axios';
import React, { useState } from 'react'

export default function ReviewForm({accommodationId}:{accommodationId:number}) {
    const [content,setContent] = useState('');
    const [rating,setRatig] = useState(5);
    const handleSubimit = async (e: React.FormEvent) =>{
        e.preventDefault();
        await axios.post("/api/reviews", { content, rating, accommodationId });
      alert("レビューを投稿しました");
      setContent("");
      setRatig(5);

    }
    

  return (
    <div>
        <form onSubmit={handleSubimit}>
            <div className='mb-4'>
                <label>レビュー内容
                    <textarea value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
            placeholder="ここにレビューを入力してください..."
            rows={4}/>
                </label>
            </div>
            <div className='mb-4'>
                <label>レイト(1~5)
                    <input type='number' value={rating}
                    onChange={(e) =>setRatig(Number(e.target.value))}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </label>
            </div>
            <button type='submit' className='mb-4 bg-red-500 text-white p-2 rounded-r-md hover:opacity-50'>投稿する</button>
        </form>
    </div>
  )
}
