import { NextResponse } from "next/server";
import {auth} from "@clerk/nextjs"
import prismadb from "@/lib/prismadb";
export async function POST(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {userId} =auth();
        const body = await req.json();
        const {name,value}=body
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!name){
            return new NextResponse("El nombre es requerido",{status:400});
        }
        if(!value){
            return new NextResponse("El valor es requerido",{status:400});
        }
        if (!params.storeId){
            return new NextResponse("El ID de la productora es requerido",{status:400});
        }
        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse("No autenticado",{status:405});
        }
        const color = await prismadb.color.create({
            data:{
                name,
                value,
                storeId: params.storeId,
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLORS_POST]',error);
        return new NextResponse("Interal error",{status:500});
    }
};
export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try{
        if (!params.storeId){
            return new NextResponse("El id de la productora es requerido",{status:400});
        }
        const colors = await prismadb.color.findMany({
            where:{
                storeId: params.storeId,

            }
        });
        return NextResponse.json(colors);
    }catch(error){
        console.log('[COLORS_GET]',error);
        return new NextResponse("Interal error",{status:500});
    }
};