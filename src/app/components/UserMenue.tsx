import Link from 'next/link'
import React from 'react'
import { getSessionUser } from '../utils/getSessionUser';


export default async function UserMenue() {
  const user = await getSessionUser(); 
  return (
    <div className=' fixed bottom-0 py-2  bg-white z-50 w-full'>
      <ul className='flex justify-center gap-2  md:gap-10 flex-wrap border-t bborder-gray-400 '>
         <li className='hover:underline '><Link href={"/favoritesPage"} className='text-xs md:text-base'>お気に入り</Link></li>
         <li className='hover:underline '><Link href={"/userOption"} className='text-xs md:text-base'>アカウント</Link></li>
         <li className='hover:underline '><Link href={"/messages"} className='text-xs md:text-base'>メッセージ</Link></li>
         <li className='hover:underline '><Link href={"/reservations"} className='text-xs md:text-base'>予約リスト</Link></li>
         {user?.role === "ADMIN" && 
            <li className='hover:underline '><Link href="/admin"  className='text-xs md:text-base'>管理者ページ</Link>
            </li>}
            {(user?.role === "HOST" ||  user?.role === "ADMIN") &&
            <li className='hover:underline '><Link href="/host"  className='text-xs md:text-base'>オーナーページ</Link>
            </li>}
         </ul>
    </div>
  )
}
