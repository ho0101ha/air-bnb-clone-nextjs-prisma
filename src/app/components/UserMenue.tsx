import Link from 'next/link'
import React from 'react'

export default function UserMenue() {
  return (
    <div className=' fixed bottom-0 py-2  bg-white z-50 w-full'>
      <ul className='flex justify-around border-t border-gray-400 '>
         <li className='hover:underline'><Link href={"/favoritesPage"}>お気に入り</Link></li>
         <li className='hover:underline'><Link href={"/userOption"}>アカウント</Link></li>
         <li className='hover:underline'><Link href={"/messages"}>メッセージ</Link></li>
         <li className='hover:underline'><Link href={"/reservations"}>予約リスト</Link></li>
         </ul>
    </div>
  )
}
