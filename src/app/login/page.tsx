"use client";
import axios from "axios";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Login() {
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
        const response = await axios.post("/api/users", {
          name,
          email,
          password,
        });

        if (response.status !== 200) {
          throw new Error(response.data.error || "登録に失敗しました。");
        }

        alert("新規登録が完了しました。自動的にログインします。");

        const loginResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (loginResult?.error) {
          throw new Error(loginResult.error);
        }

        router.push("/");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        throw new Error(result.error);
      }

      router.push("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "エラーが発生しました。もう一度お試しください。");
      } else {
        setError("予期しないエラーが発生しました。");
      }
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
      </div>
    </div>
  );
}
