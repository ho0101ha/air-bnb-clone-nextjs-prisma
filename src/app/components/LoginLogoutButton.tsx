"use client"
import React from 'react'
import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';

interface LoginLogoutButtonProps {
  isLoggedIn: boolean;
}

export default function LoginLogoutButton({isLoggedIn}:LoginLogoutButtonProps) {

    return isLoggedIn ? (
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-red-600"
        >
          ログアウト
        </button>
      ) : (
        <Link
          href="/login" // ログインページへのリンクを設定
          className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-blue-600"
        >
          ログイン
        </Link>
      );
    }