"use client";

import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

type UserType = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type AccommodationType = {
  id: number;
  name: string;
  location: string;
  price: number;
};

type ReservationType = {
  id: number;
  name: string;
  email: string;
  startDate: string;
  endDate: string;
  accommodation: { name: string };
};

type HostRequestType = {
  id: number;
  userId: number;
  user: { name: string; email: string };
  status: string;
};

type Props = {
  users: UserType[];
  accommodations: AccommodationType[];
  reservations: ReservationType[];
  hostRequests: HostRequestType[];  // ← これを追加
};

export default function AdminPageClient({ users, accommodations, reservations,hostRequests }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // APIエンドポイントを定数化
  const API_ENDPOINTS = {
    user: "/api/admin/user",
    accommodation: "/api/admin/accommodation",
    reservation: "/api/admin/reservation",
  };
  
  // データ削除
  const handleDelete = async (id: number, type: keyof typeof API_ENDPOINTS) => {
    setLoading(true);
    try {
      await axios.delete(API_ENDPOINTS[type], { data: { id } });
      alert(`${type} を削除しました`);
      router.refresh();
    } catch (error) {
      alert("削除に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ユーザーの役割更新
  const handleUpdateUserRole = async (id: number, role: "USER" | "HOST") => {
    setLoading(true);
    try {
      await axios.patch(API_ENDPOINTS.user, { id, role });
      alert(`ユーザーの権限を ${role} に変更しました`);
      router.refresh();
    } catch (error) {
      alert("更新に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 予約の更新（チェックイン・チェックアウトの日付変更）
  const handleUpdateReservation = async (id: number, startDate: string, endDate: string) => {
    setLoading(true);
    try {
      // 送信するデータを確認
      // console.log("Updating reservation:", { id, startDate, endDate });

      // 日付をISO形式に変換zw
      const updatedStartDate = new Date(startDate).toISOString();
      const updatedEndDate = new Date(endDate).toISOString();

      await axios.patch(API_ENDPOINTS.reservation, { id, startDate: updatedStartDate, endDate: updatedEndDate });
      alert("予約を更新しました");
      router.refresh();
    } catch (error) {
      // エラーメッセージを詳しく表示
      alert("更新に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  //HOST申請の受け取り
  const handleHostRequest = async (id: number, userId: number, approved: boolean) => {
    setLoading(true);
    try {
      await axios.patch("/api/host-request", { id, userId, approved });
      alert(`ユーザーを ${approved ? "HOST" : "申請却下"} にしました`);
      router.refresh();
    } catch (error) {
      alert("処理に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="p-5">
      <h1 className="text-xl font-bold">管理者ページ</h1>

      {/* ユーザー管理 */}
      <section className="mt-6">
    <h2 className="text-lg font-bold">HOST 申請管理</h2>
    <table className="w-full border-collapse border border-gray-300 mt-2">
    <thead>
      <tr>
        <th className="border p-2">ユーザー名</th>
        <th className="border p-2">メール</th>
        <th className="border p-2">ステータス</th>
        <th className="border p-2">操作</th>
      </tr>
    </thead>
    <tbody>
      {hostRequests.map((req) => (
        <tr key={req.id}>
          <td className="p-2">{req.user.name}</td>
          <td className="p-2">{req.user.email}</td>
          <td className="p-2">{req.status}</td>
          <td className="p-2 flex gap-2">
            {req.status === "PENDING" && (
              <>
                <button
                  onClick={() => handleHostRequest(req.id, req.userId, true)}
                  className="bg-green-500 text-white p-1 rounded"
                >
                  承認
                </button>
                <button
                  onClick={() => handleHostRequest(req.id, req.userId, false)}
                  className="bg-red-500 text-white p-1 rounded"
                >
                  却下
                </button>
              </>
            )}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</section>
      <section className="mt-6">
        <h2 className="text-lg font-bold">ユーザー管理</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border p-2">名前</th>
              <th className="border p-2">メール</th>
              <th className="border p-2">役割</th>
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="p-2">{user.name}</td>
                <td className="p-2">{user.email}</td>
                <td className="p-2">{user.role}</td>
                <td className="p-2 flex gap-2">
                  <button
                    onClick={() => handleUpdateUserRole(user.id, user.role === "HOST" ? "USER" : "HOST")}
                    disabled={loading}
                    className="bg-blue-500 text-white p-1 rounded"
                  >
                    {user.role === "HOST" ? "USER に変更" : "HOST に変更"}
                  </button>
                  <button
                    onClick={() => handleDelete(user.id, "user")}
                    disabled={loading}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 宿泊先管理 */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">宿泊先管理</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border p-2">宿泊先名</th>
              <th className="border p-2">所在地</th>
              <th className="border p-2">価格</th>
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {accommodations.map((acc) => (
              <tr key={acc.id}>
                <td className="p-2">{acc.name}</td>
                <td className="p-2">{acc.location}</td>
                <td className="p-2">{acc.price}</td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(acc.id, "accommodation")}
                    disabled={loading}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* 予約管理 */}
      <section className="mt-6">
        <h2 className="text-lg font-bold">予約管理</h2>
        <table className="w-full border-collapse border border-gray-300 mt-2">
          <thead>
            <tr>
              <th className="border p-2">ユーザー名</th>
              <th className="border p-2">宿泊先名</th>
              <th className="border p-2">チェックイン</th>
              <th className="border p-2">チェックアウト</th>
              <th className="border p-2">操作</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id}>
                <td className="p-2">{res.name}</td>
                <td className="p-2">{res.accommodation.name}</td>
                <td className="p-2">
                  <input
                    type="date"
                    value={res.startDate.split("T")[0]}
                    onChange={(e) => handleUpdateReservation(res.id, e.target.value, res.endDate)}
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="date"
                    value={res.endDate.split("T")[0]}
                    onChange={(e) => handleUpdateReservation(res.id, res.startDate, e.target.value)}
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <button
                    onClick={() => handleDelete(res.id, "reservation")}
                    disabled={loading}
                    className="bg-red-500 text-white p-1 rounded"
                  >
                    削除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
