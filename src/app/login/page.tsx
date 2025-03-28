
"use client";
import axios from "axios";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
  const { data: session } = useSession(); // ✅ layout.tsx で SessionProvider を適用したので、正常に動作するはず
  const router = useRouter();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const toggleAuthMode = () => setIsSignUp((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isSignUp) {
        // 新規登録
        const response = await axios.post("/api/users", {
          name,
          email,
          password,
        });

        if (response.status !== 200) {
          throw new Error(response.data.error || "登録に失敗しました。");
        }

        alert("新規登録が完了しました。自動的にログインします。");

        // 登録後に自動ログイン
        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.error) {
          throw new Error(loginResult.error);
        }

        router.push("/"); // ホームへ遷移
        return;
      }

      // ログイン
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/"); // ホームへ遷移
    } catch (err: any) {
      setError(err.message || "エラーが発生しました。もう一度お試しください。");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          {isSignUp ? "新規登録" : "ログイン"}
        </h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-4">
              <label className="block mb-1">お名前</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border p-2 rounded"
                required
              />
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">パスワード</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border p-2 rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
          >
            {isSignUp ? "新規登録" : "ログイン"}
          </button>
          <p className="text-sm text-center mt-4">
            {isSignUp ? "既にアカウントをお持ちですか？" : "アカウントをお持ちでない場合"}
            <span
              onClick={toggleAuthMode}
              className="text-blue-500 cursor-pointer ml-1 underline"
            >
              {isSignUp ? "ログイン" : "新規登録"}
            </span>
          </p>
        </form>
        {/* <div className="mt-6">
          <button
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mb-2"
          >
            Google でログイン
          </button>
          <button
            onClick={() => signIn("line", { callbackUrl: "/" })}
            className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 mb-2"
          >
            LINE でログイン
          </button>
          <button
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800 mb-2"
          >
            Facebook でログイン
          </button>
          <button
            onClick={() => signIn("github", { callbackUrl: "/" })}
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-900"
          >
            GitHub でログイン
          </button>
        </div>
        <div>
        <button
         onClick={() => signIn("twitter", { callbackUrl: "/" })}
        className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 mb-2">
        X（旧Twitter）でログイン
      </button>
        </div> */}
      </div>
    </div>
  );
}
