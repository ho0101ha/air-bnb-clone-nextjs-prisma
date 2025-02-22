"use client";
import axios from 'axios';
import React, { useState } from 'react'

type Reservation ={
   id:number;
   accommodation:{
    name:string;
    
   };
   people:number;
   startDate:string;
   endDate:string;
}
export default function ReservationActions({reservations = []}:{reservations:Reservation[]}) {
    const [editReservation,setEditReservation] = useState<any>(null);
    
     const handleEditReservation = async(e:any)=>{
        e.preventDefault();
        await axios.patch("/api/host/reservations",editReservation);
        alert('予約を更新しました');
        window.location.reload();
     }

      const handleDeleteReservation = async(id:number)=>{
      if(confirm('予約を削除しますか？'))return;
        await axios.delete("/api/host/reservations",{data:{id}});
        alert('予約を削除しました');
        window.location.reload();
      } 
    return (
    <div>
      <h2>予約完了</h2>
        {/* 予約一覧 */}
            <ul>
                {reservations.map((reservation) => (
                    <li key={reservation.id}>
                        <span>宿泊施設: {reservation.accommodation.name} </span>
                        <span>{reservation.people}人</span>
                        <span> 期間: {new Date(reservation.startDate).toLocaleDateString()} 〜 {new Date(reservation.endDate).toLocaleDateString()}
                          </span>
                        <button onClick={() => setEditReservation(reservation)}>編集</button>
                        <button onClick={() => handleDeleteReservation(reservation.id)}> 削除</button>
                    </li>
                ))}
            </ul>
            <div>
            {editReservation && (
                <form onSubmit={handleEditReservation}>
                    <h3>予約を編集</h3>
                    <label>チェックイン:
                    <input
                        name="startDate"
                        type="date"
                        value={editReservation.startDate.split("T")[0]}
                        onChange={(e) => setEditReservation({ ...editReservation, startDate: e.target.value })}
                        required
                    />
                    </label>
                    <label>チェックアウト:
                    <input
                        name="endDate"
                        type="date"
                        value={editReservation.endDate.split("T")[0]}
                        onChange={(e) => setEditReservation({ ...editReservation, endDate: e.target.value })}
                        required
                    />
                    </label>
                   
                    <button type="submit">更新</button>
                </form>
            )}
            </div>

    </div>
  )
}
