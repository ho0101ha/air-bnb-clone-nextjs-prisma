"use client";
import axios from "axios";
import React, { useState } from "react";
import Confirm from "./Confirm";
import { useRouter } from "next/navigation";

interface ReservationProps {
  accommodation: {
    price: number;
    id: number;
    name: string;
  };
  user: {
    name: string;
    email: string;
  } | null;
}

export default function Reservation({ accommodation, user }: ReservationProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [people, setPeople] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleReservation = async () => {
    if (!user || !startDate || !endDate || !people) {
      alert("すべての項目を入力してください。");
      return;
    }

    try {
      setLoading(true);
      await axios.post("/api/reservations", {
        accommodationId: Number(accommodation.id),
        name: user.name,
        people: Number(people),
        email: user.email,
        startDate,
        endDate,
      });

      await axios.post("/api/messages", {
        content: `予約が完了しました。宿泊施設 ${accommodation.name} 期間 ${startDate} ~ ${endDate}`,
      });

      alert("予約が完了しました！");
      setIsModalOpen(false);
      router.push("/"); // ✅ 安全なページ遷移方法
    } catch (error) {
      console.error(error);
      alert("予約中にエラーが発生しました。もう一度お試しください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="bg-red-500 text-white px-4 py-2 mb-5 rounded hover:opacity-80"
      >
        予約をする
      </button>

      {/* モーダル表示 */}
      {isModalOpen && !confirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">予約フォーム</h2>
            <p className="mb-2">{accommodation.name}</p>

            <div className="space-y-4">
              <div>
                <label className="block mb-1">人数</label>
                <input
                  type="number"
                  min={1}
                  value={people}
                  onChange={(e) => setPeople(Number(e.target.value))}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">チェックイン</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>

              <div>
                <label className="block mb-1">チェックアウト</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 rounded w-full"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                キャンセル
              </button>
              <button
                onClick={() => setConfirm(true)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                先へ進む
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 確認モーダル */}
      {confirm && (
        <Confirm
          key={accommodation.id} // ✅ 再レンダリング対策にkey
          accommodationId={accommodation.id}
          accommodationName={accommodation.name}
          price={accommodation.price}
          name={user?.name ?? ""}
          people={people}
          email={user?.email ?? ""}
          startDate={startDate}
          endDate={endDate}
          handleCancel={() => setConfirm(false)}
          handleReservation={handleReservation}
        />
      )}

      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 z-50 flex items-center justify-center">
          <div className="text-white text-lg">予約処理中...</div>
        </div>
      )}
    </div>
  );
}
