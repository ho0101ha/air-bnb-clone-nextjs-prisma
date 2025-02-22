"use client";
import axios from "axios";
import React, { useState } from "react";

type Property = {
  id: string;
  name: string;
  description: string;
  location: string;
  price: number;
  locationJP: string;
  imageUrl: string;
};

export default function AccommodationActions({
  properties = [],
}: {
  properties: Property[];
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    price: 0,
    locationJP: "",
    imageUrl: "",
  });

  const [editData, setEditData] = useState<Property | null>(null);

  // 入力フォームの変更
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 追加処理
  const handleAddAccommodation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/host/accommodations", formData);
      alert("宿泊施設を追加しました");
      window.location.reload();
    } catch (error) {
      console.error("追加に失敗しました", error);
    }
  };

  // 更新処理
  const handleEditAccommodation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editData) return;

    try {
      const response = await axios.patch("/api/host/accommodation", editData);
      console.log("サーバーからのレスポンス:", response.data);
      alert("宿泊施設を変更しました");
      window.location.reload();
    } catch (error) {
      console.error("宿泊施設の更新エラー:", error);
      alert("宿泊施設の更新に失敗しました");
    }
  };

  // 削除処理
  const handleDeleteAccommodation = async (id: string) => {
    if (!confirm("削除しますか？")) return;
    try {
      await axios.delete("/api/host/accommodations", { data: { id } });
      alert("宿泊施設を削除しました");
      window.location.reload();
    } catch (error) {
      console.error("削除に失敗しました", error);
    }
  };

  return (
    <div>
      <h2>宿泊地追加</h2>
      <div>
        <form onSubmit={handleAddAccommodation}>
          <label>
            宿泊施設名:
            <input name="name" onChange={handleChange} />
          </label>
          <label>
            説明:
            <input name="description" onChange={handleChange} />
          </label>
          <label>
            価格:
            <input
              type="number"
              name="price"
              onChange={(e) =>
                setFormData({ ...formData, price: parseFloat(e.target.value) })
              }
            />
          </label>
          <label>
            所在地:
            <input name="location" onChange={handleChange} />
          </label>
          <label>
            国名:
            <input name="locationJP" onChange={handleChange} />
          </label>
          <label>
            画像URL:
            <input name="imageUrl" onChange={handleChange} />
          </label>
          <button type="submit">追加</button>
        </form>
      </div>
      <div>
        <ul>
          {properties.map((property) => (
            <li key={property.id}>
              <span>
                {property.name} - {property.location}
              </span>
              <button onClick={() => handleDeleteAccommodation(property.id)}>
                削除
              </button>
              <button onClick={() => setEditData(property)}>編集</button>
            </li>
          ))}
        </ul>
      </div>

      {editData && (
        <div>
          <form onSubmit={handleEditAccommodation}>
            <label>
              宿泊施設名:
              <input
                name="name"
                value={editData.name}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
              />
            </label>
            <label>
              説明:
              <input
                name="description"
                value={editData.description}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
              />
            </label>
            <label>
              価格:
              <input
                type="number"
                name="price"
                value={editData.price}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev
                      ? { ...prev, price: parseFloat(e.target.value) }
                      : prev
                  )
                }
              />
            </label>
            <label>
              所在地:
              <input
                name="location"
                value={editData.location}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, location: e.target.value } : prev
                  )
                }
              />
            </label>
            <label>
              画像URL:
              <input
                name="imageUrl"
                value={editData.imageUrl}
                onChange={(e) =>
                  setEditData((prev) =>
                    prev ? { ...prev, imageUrl: e.target.value } : prev
                  )
                }
              />
            </label>
            <button type="submit">更新</button>
          </form>
        </div>
      )}
    </div>
  );
}
