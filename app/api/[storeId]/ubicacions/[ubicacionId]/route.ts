import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{ubicacionId:string}}

){
    try{

        if(!params.ubicacionId){
            return new NextResponse("El ID de la ubicacion es requerido", {status:400})
        }

        const ubicacion = await prismadb.ubicacion.findUnique({
            where:{
                id:params.ubicacionId,
            }
        });
        return NextResponse.json(ubicacion);
    }catch(error){
        console.log('[UBICACION_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, ubicacionId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {name,value} = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }     
        if(!name){
            return new NextResponse("La ubicacion es requerida",{status:400});
        }
        if(!value){
            return new NextResponse("La hora es requerida",{status:400});
        }
        if(!params.ubicacionId){
            return new NextResponse("El ID de la ubicacion es requerido", {status:400})
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
        const ubicacion = await prismadb.ubicacion.update({
            where:{
                id:params.ubicacionId,
                
            },
            data:{
                name,
                value
            }
        });
        return NextResponse.json(ubicacion);
    }catch(error){
        console.log('[UBICACION_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,ubicacionId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:403})
        }
        if(!params.ubicacionId){
            return new NextResponse("El ID de la ubicacion es requerido", {status:400})
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
        const ubicacion = await prismadb.ubicacion.delete({
            where:{
                id:params.ubicacionId,
            }
        });
        return NextResponse.json(ubicacion);
    }catch(error){
        console.log('[UBICACION_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};