import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{colorId:string}}

){
    try{

        if(!params.colorId){
            return new NextResponse("Color id is required", {status:400})
        }

        const color = await prismadb.color.findUnique({
            where:{
                id:params.colorId,
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLOR_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, colorId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {name,value} = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!name){
            return new NextResponse("Se requiere el nombre",{status:400});
        }        
        if(!value){
            return new NextResponse("Se requiere el valor",{status:400});
        }
        if(!params.colorId){
            return new NextResponse("Se requiere el ID de la ubicacion", {status:400})
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
        const color = await prismadb.color.update({
            where:{
                id:params.colorId,
                
            },
            data:{
                name,
                value
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLOR_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,colorId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!params.colorId){
            return new NextResponse("Es requerida la ID de la ubicacion", {status:400})
        }
        const storeByUserId = await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId,
            }
        });
        if(!storeByUserId){
            return new NextResponse("No autenticado",{status:405})
        }
        const color = await prismadb.color.delete({
            where:{
                id:params.colorId,
            }
        });
        return NextResponse.json(color);
    }catch(error){
        console.log('[COLOR_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};