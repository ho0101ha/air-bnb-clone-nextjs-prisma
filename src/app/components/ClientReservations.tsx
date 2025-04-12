"use client"

import Link from 'next/link';
import React, { useState } from 'react'
import Reservation from './Reservation';
import axios from 'axios';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Reservation {
    id: number;
    accommodation: {
      id: number;
      name: string;
      imageUrl: string;
      price: number;
    };
    people: number;
    startDate: string; // `Date` → `string`
    endDate: string; 
    paid:boolean;// `Date` → `string`
  }
export default function ClientReservations({reservations}:{reservations:Reservation[]}) {
    const [reservationList,setReservationList] = useState(reservations);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        people: 1,
        startDate: "",
        endDate: "",
      });
    
      // 編集モードに切り替え
      const handleEdit = (reservation: Reservation) => {
        setEditingId(reservation.id);
        setFormData({
          people: reservation.people,
           startDate: reservation.startDate.split("T")[0], // `YYYY-MM-DD` のみ取得
      endDate: reservation.endDate.split("T")[0],
        });
      };
    
      //予約更新
      const handleUpdate = async () => {
        if (!editingId) return;
    
        try {
            const response = await axios.patch(`/api/reservations/${editingId}`, formData);

            // `reservationList` を即時更新
            setReservationList((prev) =>
              prev.map((reservation) =>
                reservation.id === editingId ? { ...reservation, ...response.data } : reservation
              )
            );
          setEditingId(null);
        } catch (error) {
          console.error("予約変更エラー:", error);
        }
      };
    //削除
    const handleDelete = async (id: number) => {
        if (!confirm("本当に予約を削除しますか？")) return;
    
        try {
            
            // 最新のデータを取得して更新
            await axios.delete(`/api/reservations/${id}`);

            // `reservationList` を即時更新
            setReservationList((prev) => prev.filter((reservation) => reservation.id !== id));
        
    } catch (error) {
          console.error("予約削除エラー:", error);
        }
      };
      const handlePayment = async(reservation:Reservation) =>{
        try {
          const {data} = await axios.post("/api/checkout",{
            accommodationName:reservation.accommodation.name,
            price:reservation.accommodation.price,
            reservationId:reservation.id,
          });
          const stripe = await stripePromise;
          if (!stripe) throw new Error("Stripe の初期化に失敗しました");
          // 2. Stripe の決済ページにリダイレクト
          const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
          if (error) throw new Error(error.message);
          // window.location.href = data.url;
        } catch (error) {
          console.error("支払いエラー",error);
          alert('支払いエラーが発生しました');
        }
   
      }
    
    return(
        <div>
        {reservations.length === 0 ? <p className='text-center mb-4'>予約がございません</p>:
        (
        <div className={`${reservationList.length ===1 ? "flex justify-center" :
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}  w-full  mb-5`}>
          {reservationList.map((reservation) =>
        <div key={reservation.id} className="cursor-pointer border rounded-lg p-4 shadow-md 
        hover:shadow-lg">
          <h3 className='mb-3 text-xl'>{reservation.accommodation.name}</h3>
          <img src={reservation.accommodation.imageUrl} alt={reservation.accommodation.name} 
          className="w-full h-48 object-cover rounded-lg mb-4"/>
          {editingId === reservation.id ? (
                <div className='mb-3'>
                  <label>チェックイン: </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <label>チェックアウト: </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="border p-2 rounded w-full"
                  />
                  <label>人数: </label>
                  <input
                    type="number"
                    value={formData.people}
                    onChange={(e) => setFormData({ ...formData, people: Number(e.target.value) })}
                    className="border p-2 rounded w-full"
                  />
                  <button onClick={handleUpdate} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mt-2">
                    更新
                  </button>
                </div>):(
           <div ><p className='mb-3'>チェックイン:{new Date(reservation.startDate).toLocaleDateString()}</p>
           <p className='mb-3'>チェックアウト:{new Date(reservation.endDate).toLocaleDateString()}</p>
           <p className='mb-3'>{reservation.accommodation.price}/泊</p>
           <p className='mb-3'>支払い状況:{reservation.paid? "支払い済み":"未払い"}</p>
           {!reservation.paid && (
            <button onClick={() =>handlePayment(reservation)}>支払う</button>
           )}
           <button onClick={() =>handleEdit(reservation)}
            className='block border border-black p-2 mb-3 text-center  rounded-md hover:bg-red-500 hover:text-white '>
              変更</button>
           </div>
          )}
          
          <button onClick={() => handleDelete(reservation.id)}
            className='block border border-black p-2 mb-3 text-center rounded-md hover:bg-red-500 hover:text-white'>
              削除</button>
          <Link href={`/accommodation/${reservation.accommodation.id}`}
          className='block bg-red-500 w-1/3 text-white p-2 text-center rounded-md hover:opacity-50'>
          more</Link>
        </div>)}
          </div>
          )}
         
      </div>
    )
    
}
