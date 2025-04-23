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
    <div className="p-4 sm:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-xl sm:text-2xl font-bold">管理者ページ</h1>
  
      {/* HOST申請管理 */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2">HOST 申請管理</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
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
                  <td className="p-2 border">{req.user.name}</td>
                  <td className="p-2 border">{req.user.email}</td>
                  <td className="p-2 border">{req.status}</td>
                  <td className="p-2 border">
                    {req.status === "PENDING" && (
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleHostRequest(req.id, req.userId, true)}
                          className="bg-green-500 text-white px-2 py-1 rounded text-sm"
                        >
                          承認
                        </button>
                        <button
                          onClick={() => handleHostRequest(req.id, req.userId, false)}
                          className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                        >
                          却下
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
  
      {/* ユーザー管理 */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2">ユーザー管理</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
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
                  <td className="p-2 border">{user.name}</td>
                  <td className="p-2 border">{user.email}</td>
                  <td className="p-2 border">{user.role}</td>
                  <td className="p-2 border">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleUpdateUserRole(user.id, user.role === "HOST" ? "USER" : "HOST")}
                        disabled={loading}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        {user.role === "HOST" ? "USER に変更" : "HOST に変更"}
                      </button>
                      <button
                        onClick={() => handleDelete(user.id, "user")}
                        disabled={loading}
                        className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                      >
                        削除
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
  
      {/* 宿泊先管理 */}
      <section className="mt-6">
        <h2 className="text-lg sm:text-xl font-bold mb-2">宿泊先管理</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
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
                  <td className="p-2 border">{acc.name}</td>
                  <td className="p-2 border">{acc.location}</td>
                  <td className="p-2 border">¥{acc.price.toLocaleString()}</td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(acc.id, "accommodation")}
                      disabled={loading}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
  
      {/* 予約管理 */}
      <section className="mt-6 mb-10">
        <h2 className="text-lg sm:text-xl font-bold mb-2">予約管理</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300 text-sm sm:text-base">
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
                  <td className="p-2 border">{res.name}</td>
                  <td className="p-2 border">{res.accommodation.name}</td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      value={res.startDate.split("T")[0]}
                      onChange={(e) => handleUpdateReservation(res.id, e.target.value, res.endDate)}
                      className="border p-1 rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <input
                      type="date"
                      value={res.endDate.split("T")[0]}
                      onChange={(e) => handleUpdateReservation(res.id, res.startDate, e.target.value)}
                      className="border p-1 rounded"
                    />
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => handleDelete(res.id, "reservation")}
                      disabled={loading}
                      className="bg-red-500 text-white px-2 py-1 rounded text-sm"
                    >
                      削除
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
  
}
