import { getServerSession } from 'next-auth'
import React from 'react'
import { authOptions } from '../api/auth/[...nextauth]/route'
import Link from 'next/link';
import prisma from '@/lib/prisma';
import Reservation from '../components/Reservation';
import ReviewForm from '../components/ReviewForm';

export default  async function FavoritesPage() {
    const  session = await getServerSession(authOptions);
    if(!session?.user){
        return(
        <div>
         <div>
            <h2>お気に入りを見るにはログインが必要です</h2>
            <Link href={"/login"}></Link>
         </div>
        </div>)
       
    }
    const favoriteAccommodations = await prisma.favorite.findMany({
        where:{userId:parseInt(session.user.id,10)},
        include:{accommodation:true}
    });
    
  return (
    <div>
      <h1 className='text-center py-10 text-2xl font-bold'>お気に入りの宿泊地</h1>
      {favoriteAccommodations.length === 0? 
      <div>
        <p className='text-center py-5'>お気に入りのページがありません</p>     
        </div> :(
        <div className={`${favoriteAccommodations.length ===1 ? "flex justify-center" :"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"}  w-full  mb-5`} >
            {favoriteAccommodations.map((favorite) =>(
                <div 
                key={favorite.accommodation.id}
                className="cursor-pointer border rounded-lg p-4 shadow-md hover:shadow-lg "
              >
                <img
                  src={favorite.accommodation.imageUrl}
                  alt={favorite.accommodation.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h3 className="text-lg font-semibold">{favorite.accommodation.name}</h3>
                <p>{favorite.accommodation.description}</p>
                <p className="text-sm text-gray-600">{favorite.accommodation.locationJP}</p>
                <p className="text-lg font-bold">¥{favorite.accommodation.price}/泊</p>
                <div className="flex justify-between items-center mt-4">
                  <Link
                    href={`accommodation/${favorite.accommodation.id}`}
                    className="rounded-md border border-black p-2 hover:bg-red-500 hover:text-white"
                  >
                    more
                  </Link>
       
                </div>
              </div>
            ))}
             
        </div>
      )}
      <Link href={"/"} className='block text-center hover:underline'>トップへ戻る</Link>
    </div>
  )
}
