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
        const {name,value,quantity}=body
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
        const entrada = await prismadb.entrada.create({
            data:{
                name,
                value,
                quantity,
                storeId: params.storeId,
            }
        });
        return NextResponse.json(entrada);
    }catch(error){
        console.log('[ENTRADAS_POST]',error);
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
        const entradas = await prismadb.entrada.findMany({
            where:{
                storeId: params.storeId,

            }
        });
        return NextResponse.json(entradas);
    }catch(error){
        console.log('[ENTRADAS_GET]',error);
        return new NextResponse("Interal error",{status:500});
    }
};