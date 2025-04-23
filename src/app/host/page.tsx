"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Property{
  name:string;
  location:string;
}
interface Accommodation {
  id: number | null;
  name: string;
  description: string;
  locationJP: string;
  imageUrl: string;
  price: number;
  property:Property;
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

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [newAccommodation, setNewAccommodation] = useState<Accommodation>({
    id: null,
    name: "",
    description: "",
    locationJP: "",
    imageUrl: "",
    price: 0,
    property: {
      name: "",
      location: "",
    },
  });


  const [editingAccommodation, setEditingAccommodation] = useState<Accommodation | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);

  // 宿泊施設と予約データを取得
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get("/api/host");
        setAccommodations(data.accommodations);
        setReservations(data.reservations);
      } catch (error) {
        console.error("データ取得失敗:", error);
        setError("データの取得に失敗しました");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  
  const handleSaveAccommodation = async () => {
    if (!editingAccommodation) return;
  
    console.log("送信する宿泊施設データ:", editingAccommodation); 
  
    try {
      await axios.put("/api/host/accommodation", { accommodation: editingAccommodation });
      setAccommodations(accommodations.map((acc) => (acc.id === editingAccommodation.id ? editingAccommodation : acc)));
      setEditingAccommodation(null);
      alert('宿泊施設を更新しました');
    } catch (error) {
      console.error("宿泊施設の保存に失敗:", error); 
      alert("保存に失敗しました");
    }
  };
  

  
  const handleSaveReservation = async () => {
    if (!editingReservation) return;
  
    try {
      const response = await axios.put("/api/host/reservation", { reservation: editingReservation });
      const updatedReservation = response.data;
      setReservations(reservations.map((res) => (res.id === updatedReservation.id ? updatedReservation : res)));
      setEditingReservation(null);
      alert('予約を変更しました');
    } catch (error) {
      alert("予約の保存に失敗しました");
      console.log("reservation 変更に失敗しました", error);
    }
  };


  const handleAddAccommodation = async () => {
    if (
      !newAccommodation.name.trim() ||
      !newAccommodation.description.trim() ||
      !newAccommodation.locationJP.trim() ||
      !selectedImage ||
      newAccommodation.price <= 0
    ) {
      alert("すべての項目を入力してください");
      return;
    }
  
    try {
      const formData = new FormData();
      formData.append("image", selectedImage);
  
      // 画像アップロード
      const uploadRes = await axios.post("/api/host/upload", formData);
      const imageUrl = uploadRes.data.imageUrl;
  
      // 宿泊施設追加リクエスト
      const response = await axios.post("/api/host/accommodation", {
        name: newAccommodation.name,
        description: newAccommodation.description,
        location: newAccommodation.property.location,
        locationJP: newAccommodation.locationJP,
        imageUrl, // ここがアップロード後の画像URL
        price: newAccommodation.price,
      });
  
      setAccommodations([...accommodations, response.data]);
  
      // リセット
      setNewAccommodation({
        id: null,
        name: "",
        description: "",
        locationJP: "",
        imageUrl: "",
        price: 0,
        property: {
          name: "",
          location: "",
        },
      });
      setSelectedImage(null);
  
      alert("宿泊施設を追加しました");
    } catch (error) {
      console.error("宿泊施設の追加に失敗しました:", error);
      alert("宿泊施設の追加に失敗しました");
    }
  };
  
  const handleDelete = async (id: number | null, type: "accommodation" | "reservation") => {
    if (!confirm(`本当に削除しますか？`)) return;

    try {
      
      if (type === "accommodation") {
        await axios.delete("/api/host/accommodation", { data: { id } });
        setAccommodations(accommodations.filter((acc) => acc.id !== id));
      } else {
        await axios.delete("/api/host/reservation", { data: { id} });
        setReservations(reservations.filter((res) => res.id !== id));
      }
    } catch (error) {
      console.error("宿泊施設の削除に失敗しました:", error);
      alert("削除に失敗しました");
    }
  };

  if (loading) return <p>読み込み中...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 sm:p-6 lg:p-10 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">ホスト管理ページ</h1>
  
      {/* 宿泊施設一覧 */}
      <h2 className="text-xl font-semibold mt-6 mb-2">宿泊施設一覧</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {accommodations.map((acc) => (
          <div key={acc.id} className="border p-4 rounded-lg shadow-md">
            {editingAccommodation?.id === acc.id ? (
              <>
                <input type="text" value={editingAccommodation.name} onChange={(e) => setEditingAccommodation({ ...editingAccommodation, name: e.target.value })} className="border p-2 w-full mb-2" />
                <input type="text" value={editingAccommodation.description} onChange={(e) => setEditingAccommodation({ ...editingAccommodation, description: e.target.value })} className="border p-2 w-full mb-2" />
                <input type="text" value={editingAccommodation.locationJP} onChange={(e) => setEditingAccommodation({ ...editingAccommodation, locationJP: e.target.value })} className="border p-2 w-full mb-2" />
                <input type="text" value={editingAccommodation.imageUrl} onChange={(e) => setEditingAccommodation({ ...editingAccommodation, imageUrl: e.target.value })} className="border p-2 w-full mb-2" />
                <input type="number" value={editingAccommodation.price} onChange={(e) => setEditingAccommodation({ ...editingAccommodation, price: Number(e.target.value) })} className="border p-2 w-full mb-2" />
                <button onClick={handleSaveAccommodation} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">保存</button>
              </>
            ) : (
              <div>
                <h3 className="text-lg font-semibold pb-2">{acc.name}</h3>
                <p className="pb-2">{acc.description}</p>
                <p className="pb-2">所在地: {acc.locationJP}</p>
                <img src={acc.imageUrl} alt={acc.name} className="w-full h-40 object-cover rounded-md mb-2" />
                <p className="pb-2">価格: ¥{acc.price.toLocaleString()}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditingAccommodation(acc)} className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">編集</button>
                  <button onClick={() => handleDelete(acc.id, "accommodation")} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">削除</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
  
      {/* 予約一覧 */}
      <h2 className="text-xl font-semibold mt-10 mb-2">予約一覧</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {reservations.map((res) => (
          <div key={res.id} className="border p-4 rounded-lg shadow-md">
            {editingReservation?.id === res.id ? (
              <>
                <input type="number" value={editingReservation.people} onChange={(e) => setEditingReservation({ ...editingReservation, people: Number(e.target.value) })} className="border p-2 w-full mb-2" />
                <input type="date" value={editingReservation.startDate} onChange={(e) => setEditingReservation({ ...editingReservation, startDate: e.target.value })} className="border p-2 w-full mb-2" />
                <input type="date" value={editingReservation.endDate} onChange={(e) => setEditingReservation({ ...editingReservation, endDate: e.target.value })} className="border p-2 w-full mb-2" />
                <button onClick={handleSaveReservation} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full">保存</button>
              </>
            ) : (
              <>
                <h3 className="text-md font-semibold">宿泊施設ID: {res.accommodationId}</h3>
                <p className="pb-1">予約者: {res.name}</p>
                <p className="pb-1">人数: {res.people}人</p>
                <p className="pb-1">チェックイン: {res.startDate}</p>
                <p className="pb-2">チェックアウト: {res.endDate}</p>
                <div className="flex gap-2">
                  <button onClick={() => setEditingReservation(res)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">編集</button>
                  <button onClick={() => handleDelete(res.id, "reservation")} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">削除</button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
  
      {/* 新規宿泊施設登録 */}
      <div className="mt-10 border p-4 rounded-lg max-w-xl w-full mx-auto">
        <h2 className="text-xl font-semibold mb-4">新規宿泊施設登録</h2>
        <div className="flex flex-col space-y-3">
          <input type="text" placeholder="宿泊施設名" value={newAccommodation.name} onChange={(e) => setNewAccommodation({ ...newAccommodation, name: e.target.value })} className="border p-2 rounded w-full" />
          <input type="text" placeholder="説明" value={newAccommodation.description} onChange={(e) => setNewAccommodation({ ...newAccommodation, description: e.target.value })} className="border p-2 rounded w-full" />
          <input type="text" placeholder="都市名" value={newAccommodation.locationJP} onChange={(e) => setNewAccommodation({ ...newAccommodation, locationJP: e.target.value })} className="border p-2 rounded w-full" />
          <input type="file" accept="image/*" onChange={(e) => { const file = e.target.files?.[0] || null; setSelectedImage(file); }} className="w-full" />
          <input type="number" placeholder="値段" value={newAccommodation.price} onChange={(e) => setNewAccommodation({ ...newAccommodation, price: Number(e.target.value) })} className="border p-2 rounded w-full" />
          <h3 className="text-md font-semibold">所有者情報</h3>
          <input type="text" placeholder="所有者名" value={newAccommodation.property.name} onChange={(e) => setNewAccommodation({ ...newAccommodation, property: { ...newAccommodation.property, name: e.target.value } })} className="border p-2 rounded w-full" />
          <input type="text" placeholder="所有者所在地" value={newAccommodation.property.location} onChange={(e) => setNewAccommodation({ ...newAccommodation, property: { ...newAccommodation.property, location: e.target.value } })} className="border p-2 rounded w-full" />
          <button onClick={handleAddAccommodation} className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">宿泊施設を追加</button>
        </div>
      </div>
    </div>
  );
}  