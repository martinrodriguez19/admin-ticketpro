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
        if(!value){
            return new NextResponse("El valor es requerido",{status:400});
        }
        if (!params.storeId){
            return new NextResponse("El ID del local es requerido",{status:400});
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
        const fecha = await prismadb.fecha.create({
            data:{
                name,
                value,
                storeId: params.storeId,
            }
        });
        return NextResponse.json(fecha);
    }catch(error){
        console.log('[FECHAS_POST]',error);
        return new NextResponse("Interal error",{status:500});
    }
};
export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try{
        if (!params.storeId){
            return new NextResponse("El ID del local es requerido",{status:400});
        }
        const fechas = await prismadb.fecha.findMany({
            where:{
                storeId: params.storeId,

            }
        });
        return NextResponse.json(fechas);
    }catch(error){
        console.log('[FECHAS_GET]',error);
        return new NextResponse("Interal error",{status:500});
    }
};