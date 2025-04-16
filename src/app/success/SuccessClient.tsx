"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div>
      <p>セッションID: {sessionId}</p>
    </div>
  );
}
