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

type Props = {
  users: UserType[];
  accommodations: AccommodationType[];
  reservations: ReservationType[];
};

export default function AdminPageClient({ users, accommodations, reservations }: Props) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // 削除用の関数
  const handleDelete = async (id: number, type: "user" | "accommodation" | "reservation") => {
    setLoading(true);
    try {
      let url = "";
      if (type === "user") {
        url = "/api/admin/user";
      } else if (type === "accommodation") {
        url = "/api/admin/accommodation";
      } else if (type === "reservation") {
        url = "/api/admin/reservation";
      }

      await axios.delete(url, { data: { id } });
      alert(`${type} を削除しました`);
      router.refresh();
    } catch (error) {
      alert("削除に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ユーザーの役割変更用の関数
  const handleUpdateUserRole = async (id: number, role: "USER" | "HOST") => {
    setLoading(true);
    try {
      await axios.patch("/api/admin/user", { id, role });
      alert(`ユーザーの権限を ${role} に変更しました`);
      router.refresh();
    } catch (error) {
      alert("更新に失敗しました");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 予約の更新用の関数（チェックイン・チェックアウトの日付変更）
  const handleUpdateReservation = async (id: number, checkIn: string, checkOut: string) => {
    setLoading(true);
    try {
      // API 側のパラメーター名に合わせて startDate, endDate を送信する
      await axios.patch("/api/admin/reservation", { id, startDate: checkIn, endDate: checkOut });
      alert("予約を更新しました");
      router.refresh();
    } catch (error) {
      alert("更新に失敗しました");
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
                  {user.role === "HOST" ? (
                    <button
                      onClick={() => handleUpdateUserRole(user.id, "USER")}
                      disabled={loading}
                      className="bg-blue-500 text-white p-1 rounded"
                    >
                      USER に変更
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpdateUserRole(user.id, "HOST")}
                      disabled={loading}
                      className="bg-green-500 text-white p-1 rounded"
                    >
                      HOST に変更
                    </button>
                  )}
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
                    defaultValue={new Date(res.startDate).toISOString().substring(0, 10)}
                    onChange={(e) =>
                      handleUpdateReservation(
                        res.id,
                        e.target.value,
                        new Date(res.endDate).toISOString().substring(0, 10)
                      )
                    }
                    className="border p-1"
                  />
                </td>
                <td className="p-2">
                  <input
                    type="date"
                    defaultValue={new Date(res.endDate).toISOString().substring(0, 10)}
                    onChange={(e) =>
                      handleUpdateReservation(
                        res.id,
                        new Date(res.startDate).toISOString().substring(0, 10),
                        e.target.value
                      )
                    }
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
