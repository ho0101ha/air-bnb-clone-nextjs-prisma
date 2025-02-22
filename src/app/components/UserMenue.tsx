import Link from 'next/link'
import React from 'react'
import { getSessionUser } from '../utils/getSessionUser';

export default async function UserMenue() {
  const user = await getSessionUser(); 
  return (
    <div className=' fixed bottom-0 py-2  bg-white z-50 w-full'>
      <ul className='flex justify-around border-t border-gray-400 '>
         <li className='hover:underline'><Link href={"/favoritesPage"}>お気に入り</Link></li>
         <li className='hover:underline'><Link href={"/userOption"}>アカウント</Link></li>
         <li className='hover:underline'><Link href={"/messages"}>メッセージ</Link></li>
         <li className='hover:underline'><Link href={"/reservations"}>予約リスト</Link></li>
         {user?.role === "ADMIN" && 
            <li><Link href="/admin">アプリ管理者ページ</Link>
            </li>}
            {user?.role === "HOST" && 
            <li><Link href="/host">宿泊先オーナーページ</Link>
            </li>}
         </ul>
    </div>
  )
}
