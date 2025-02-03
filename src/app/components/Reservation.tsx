"use client";
import axios from "axios";
import React, { useState } from "react";
import Confirm from "./Confirm";



interface ReservationProps {
  accommodation: {
    id: number;
    name: string;
  };
  people?: number; // 必要ならオプショナルにする
}

export default function Reservation({ accommodation }: ReservationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirm,setConfirm] = useState(false);
  const [name, setName] = useState("");
  const [people, setPeople] = useState(1);
  const [email, setEmail] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  const handleReservation = async () => {
    try {
      await axios.post("/api/reservations", {
        accommodationId: Number(accommodation.id),
        name,
        people:Number(people),
        email,
        startDate,
        endDate,
      });
      await axios.post("/api/messages",{
        content:`予約が完了しました。宿泊施設 ${accommodation.name} 期間${startDate}~${endDate}`
      })
      alert("予約が完了しました！");
      
      setIsModalOpen(false); // モーダルを閉じる
      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("予約中にエラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className=" bg-red-500 text-white px-4 py-2 mb-5 rounded hover:opacity-50"
      >
        予約をする
      </button>
      {isModalOpen && !confirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">予約フォーム</h2>
            <p>{accommodation.name}</p>
            <form className="space-y-4">
              <div>
                <label className="block">氏名</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block">人数</label>
                <input
                  type="number"
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block">メールアドレス</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block">チェックイン</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
              <div>
                <label className="block">チェックアウト</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </form>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={()=>setConfirm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                先へ進む
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm && <Confirm
      accommodationName={accommodation.name}
      name={name}
      people={people}
      email={email}
      startDate={startDate}
      endDate={endDate}
       handleCancel={()=>setConfirm(false)}
      handleReservation={handleReservation}
      />}
    </div>
  );
}



