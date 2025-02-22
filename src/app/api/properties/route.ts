import { NextResponse } from "next/server";

import { PrismaClient } from "@prisma/client";
import { getSessionUser } from "../../utils/getSessionUser";
const prisma = new PrismaClient();

export async function GET() {
    const user =  await getSessionUser();
     if(!user || user.role  !==  "HOST"){
       return NextResponse.json({error:"権限がありません"},{status:403});
     }
     const properties = await prisma.property.findMany({
        where:{ownerId:user.id},
        select:{id:true,name:true,location:true},
     });
     return NextResponse.json(properties);
}