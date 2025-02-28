"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Accommodation {
  id: number;
  name: string;
  description: string;
  locationJP: string;
  imageUrl: string;
  price: number;
}

interface Reservation {
  id: number;
  accommodationId: number;
  people: number;
  startDate: string;
  endDate: string;
  name: string;
  email: string;
}

export default function HostPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // 宿泊施設と予約データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/host");
        setAccommodations(data.accommodations);
        setReservations(data.reservations);
      } catch (err) {
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 宿泊施設を保存
  // const handleSaveAccommodation = async () => {
  //   if (!editingAccommodation) return;
  
  //   console.log("送信する宿泊施設データ:", editingAccommodation); 
  
  //   try {
  //     await axios.put("/api/host", { accommodation: editingAccommodation });
  //     setAccommodations(accommodations.map((acc) => (acc.id === editingAccommodation.id ? editingAccommodation : acc)));
  //     setEditingAccommodation(null);
  //   } catch (err) {
  //     console.error("宿泊施設の保存に失敗:", err); 
  //     alert("保存に失敗しました");
  //   }
  // };
  const handleSaveAccommodation = async () => {
    if (!editingAccommodation) return;
  
    console.log("送信する宿泊施設データ:", editingAccommodation); 
  
    try {
      await axios.put("/api/host/accommodation", { accommodation: editingAccommodation });
      setAccommodations(accommodations.map((acc) => (acc.id === editingAccommodation.id ? editingAccommodation : acc)));
      setEditingAccommodation(null);
      alert('宿泊施設を更新しました');
    } catch (err) {
      console.error("宿泊施設の保存に失敗:", err); 
      alert("保存に失敗しました");
    }
  };
  

  // 予約を保存
  // const handleSaveReservation = async () => {
  //   if (!editingReservation) return;
  
  //   try {
  //     const response = await axios.put("/api/host", { reservation: editingReservation });
  //     const updatedReservation = response.data;
  //     setReservations(reservations.map((res) => (res.id === updatedReservation.id ? updatedReservation : res)));
  //     setEditingReservation(null);
  //     alert('予約を変更しました');
  //   } catch (err) {
  //     alert("予約の保存に失敗しました");
  //     console.log("reservation 変更に失敗しました", err);
  //   }
  // };
  const handleSaveReservation = async () => {
    if (!editingReservation) return;
  
    try {
      const response = await axios.put("/api/host/reservation", { reservation: editingReservation });
      const updatedReservation = response.data;
      setReservations(reservations.map((res) => (res.id === updatedReservation.id ? updatedReservation : res)));
      setEditingReservation(null);
      alert('予約を変更しました');
    } catch (err) {
      alert("予約の保存に失敗しました");
      console.log("reservation 変更に失敗しました", err);
    }
  };

  // 宿泊施設または予約の削除
  // const handleDelete = async (id: number, type: "accommodation" | "reservation") => {
  //   if (!confirm(`本当に削除しますか？`)) return;

  //   try {
  //     await axios.delete("/api/host", { data: { id, type } });
  //     if (type === "accommodation") {
  //       setAccommodations(accommodations.filter((acc) => acc.id !== id));
  //     } else {
  //       setReservations(reservations.filter((res) => res.id !== id));
  //     }
  //   } catch (err) {
  //     alert("削除に失敗しました");
  //   }
  // };
  const handleDelete = async (id: number, type: "accommodation" | "reservation") => {
    if (!confirm(`本当に削除しますか？`)) return;

    try {
      
      if (type === "accommodation") {
        await axios.delete("/api/host/accommodation", { data: { id } });
        setAccommodations(accommodations.filter((acc) => acc.id !== id));
      } else {
        await axios.delete("/api/host/reservation", { data: { id} });
        setReservations(reservations.filter((res) => res.id !== id));
      }
    } catch (err) {
      alert("削除に失敗しました");
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">ホスト管理ページ</h1>

      {/* 宿泊施設一覧 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">宿泊施設一覧</h2>
      <div className="space-y-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {accommodations.map((acc) => (
          <div key={acc.id} className="border p-4 rounded-lg shadow-md">
            {editingAccommodation?.id === acc.id ? (
              <>
                <input
                  type="text"
                  value={editingAccommodation.name}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, name: e.target.value })}
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  value={editingAccommodation.description}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, description: e.target.value })}
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  value={editingAccommodation.locationJP}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, locationJP: e.target.value })}
                  className="border p-2 w-full"
                />
                <input
                  type="text"
                  value={editingAccommodation.imageUrl}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, imageUrl: e.target.value })}
                  className="border p-2 w-full"
                />
                <input
                  type="number"
                  value={editingAccommodation.price}
                  onChange={(e) => setEditingAccommodation({ ...editingAccommodation, price: Number(e.target.value) })}
                  className="border p-2 w-full"
                />
                <button onClick={handleSaveAccommodation} className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  保存
                </button>
                
              </>
            ) : (
              <div >
                <h3 className="text-lg font-semibold pb-3">{acc.name}</h3>
                <p className="pb-2">{acc.description}</p>
                <p className="pb-2">所在地: {acc.locationJP}</p>
                <img src={acc.imageUrl} alt={acc.name} className="w-40 h-40 object-cover rounded-md mt-2 mb-2" />
                <p className="pb-2">価格: ¥{acc.price.toLocaleString()}</p>
                <button onClick={() => setEditingAccommodation(acc)} className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:opacity-50">
                  編集
                </button>
                <button onClick={() => handleDelete(acc.id, "accommodation")} className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  削除
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 予約一覧 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">予約一覧</h2>
      <div className="space-y-4 flex gap-3">
        {reservations.map((res) => (
          <div key={res.id} className="border p-4 rounded-lg shadow-md">
            {editingReservation?.id === res.id ? (
              <>
                <input
                  type="number"
                  value={editingReservation.people}
                  onChange={(e) => setEditingReservation({ ...editingReservation, people: Number(e.target.value) })}
                  className="border p-2 w-full"
                />
                <input
                  type="date"
                  value={editingReservation.startDate}
                  onChange={(e) => setEditingReservation({ ...editingReservation, startDate: e.target.value })}
                  className="border p-2 w-full"
                />
                <input
                  type="date"
                  value={editingReservation.endDate}
                  onChange={(e) => setEditingReservation({ ...editingReservation, endDate: e.target.value })}
                  className="border p-2 w-full"
                />
                <button onClick={handleSaveReservation} className="mt-2 bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                  保存
                </button>
              </>
            ) : (
              <>
              <h3>宿泊施設ID:{res.accommodationId}</h3>
                <h4 className="text-lg font-semibold">予約者: {res.name}</h4>
                <p>人数: {res.people}人</p>
                <p>チェックイン: {res.startDate}</p>
                <p>チェックアウト: {res.endDate}</p>
                <button onClick={() => setEditingReservation(res)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">
                  編集
                </button>
                <button onClick={() => handleDelete(res.id, "reservation")} className="ml-2 bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                  削除
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
