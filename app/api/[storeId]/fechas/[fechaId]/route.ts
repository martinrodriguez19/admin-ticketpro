import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{fechaId:string}}

){
    try{

        if(!params.fechaId){
            return new NextResponse("El ID de la ubicacion es requerido", {status:400})
        }

        const fecha = await prismadb.fecha.findUnique({
            where:{
                id:params.fechaId,
            }
        });
        return NextResponse.json(fecha);
    }catch(error){
        console.log('[FECHA_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, fechaId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {name,value} = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }     
        if(!name){
            return new NextResponse("La fecha es requerida",{status:400});
        }
        if(!value){
            return new NextResponse("La hora es requerida",{status:400});
        }
        if(!params.fechaId){
            return new NextResponse("El ID de la fecha es requerido", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        });
        if(!storeByUserId){
            return new NextResponse("No autenticado",{status:405})
        }
        const fecha = await prismadb.fecha.update({
            where:{
                id:params.fechaId,
                
            },
            data:{
                name,
                value
            }
        });
        return NextResponse.json(fecha);
    }catch(error){
        console.log('[FECHA_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,fechaId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:403})
        }
        if(!params.fechaId){
            return new NextResponse("El ID de la fecha es requerido", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId,
            }
        });
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:405})
        }
        const fecha = await prismadb.fecha.delete({
            where:{
                id:params.fechaId,
            }
        });
        return NextResponse.json(fecha);
    }catch(error){
        console.log('[FECHA_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};