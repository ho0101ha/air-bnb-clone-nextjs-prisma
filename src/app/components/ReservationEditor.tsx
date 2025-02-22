"use client";

import axios from "axios";
import { useState } from "react";

export default function ReservationEditor() {
  const [id, setId] = useState("");
  const [people, setPeople] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchReservation = async () => {
    try {
      const response = await axios.get(`/api/reservations?id=${id}`);
      const data = response.data;
      setPeople(data.people);
      setStartDate(data.startDate);
      setEndDate(data.endDate);
    } catch (error) {
      console.error("予約データの取得エラー:", error);
    }
  };

  const updateReservation = async () => {
    try {
      const response = await axios.put("/api/reservations", { id, people, startDate, endDate });
      console.log("予約更新:", response.data);
    } catch (error) {
      console.error("予約更新エラー:", error);
    }
  };

  return (
    <div>
      <h2>予約の編集</h2>
      <input type="text" placeholder="予約ID" value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={fetchReservation}>予約情報を取得</button>
      <input type="number" placeholder="宿泊人数" value={people} onChange={(e) => setPeople(Number(e.target.value))} />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <button onClick={updateReservation}>予約を更新</button>
    </div>
  );
}
