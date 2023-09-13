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
        const {label,imageUrl}=body
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!label){
            return new NextResponse("Se requiere una etiqueta",{status:400});
        }
        if(!imageUrl){
            return new NextResponse("Se requiere la URL de la imagen",{status:400});
        }
        if (!params.storeId){
            return new NextResponse("Se requiere el ID de la productora",{status:400});
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
        const destacado= await prismadb.destacado.create({
            data:{
                label,
                imageUrl,
                storeId: params.storeId,
            }
        });
        return NextResponse.json(destacado);
    }catch(error){
        console.log('[DESTACADOS_POST]',error);
        return new NextResponse("Interal error",{status:500});
    }
};
export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try{
        if (!params.storeId){
            return new NextResponse("Se requiere el ID de la productora",{status:400});
        }
        const destacados= await prismadb.destacado.findMany({
            where:{
                storeId: params.storeId,

            }
        });
        return NextResponse.json(destacados);
    }catch(error){
        console.log('[DESTACADOS_GET]',error);
        return new NextResponse("Interal error",{status:500});
    }
};