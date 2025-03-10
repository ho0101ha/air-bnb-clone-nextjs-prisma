"use client";

import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useState } from "react";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ConfirmationModalProps {
  accommodationId: number;  // 
  accommodationName: string;
  price: number | undefined;
  name: string;
  people: number;
  email: string;
  startDate: string;
  endDate: string;
  handleCancel: () => void;
  handleReservation: () => void;
}


export default function Confirm({
  accommodationId,
  accommodationName,
  price,
  name,
  people,
  email,
  startDate,
  endDate,
  handleCancel,
  handleReservation,
}: ConfirmationModalProps) {
  const [loading, setLoading] = useState(false);

  const handlePaymentAndReservation = async () => {
    if (!accommodationId || price === undefined || price <= 0 || !name || !email || !startDate || !endDate) {
      alert("必要な情報が不足しています");
      console.error("エラー: 必要な情報が不足", { accommodationId, price, name, people, email, startDate, endDate });
      return;
    }
  
    setLoading(true);
    try {
      const requestData = { 
        accommodationId,  //
        price, 
        name, 
        people, 
        email, 
        startDate, 
        endDate 
      };
  
      console.log("送信データ:", requestData);
  
      // 1. 予約データを `/api/reservations` に保存
      const reservationResponse = await axios.post("/api/reservations", requestData);
      const reservationId = reservationResponse.data.id;
      console.log("予約データ保存成功:", reservationId);
  
      // 2. Stripe Checkout セッション作成
      const { data } = await axios.post("/api/checkout", {
        accommodationName,
        price,
        reservationId, // 予約IDを渡す
      });
  
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe の初期化に失敗しました");
  
      // 3. Stripe の決済ページにリダイレクト
      const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
      if (error) throw new Error(error.message);
  
    } catch (error) {
      console.error("支払い処理中にエラーが発生しました:", error);
      alert("支払い処理中にエラーが発生しました");
    }
    setLoading(false);
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">予約内容の確認</h2>
        <p><strong>宿泊施設:</strong> {accommodationName}</p>
        <p><strong>氏名:</strong> {name}</p>
        <p><strong>人数:</strong> {people}</p>
        <p><strong>メールアドレス:</strong> {email}</p>
        <p><strong>チェックイン:</strong> {startDate}</p>
        <p><strong>チェックアウト:</strong> {endDate}</p>
        <p><strong>価格:</strong> {price ? `$${price}` : "未設定"}</p>

        <div className="mt-4 flex flex-col space-y-4">
          <button
            onClick={handlePaymentAndReservation}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            disabled={loading || price === undefined || price <= 0}
          >
            {loading ? "処理中..." : "今すぐ支払って予約"}
          </button>

          <button
            onClick={handleReservation}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            後で支払う（予約のみ）
          </button>

          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          >
            修正する
          </button>
        </div>
      </div>
    </div>
  );
}
