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
        const {
            name,
            price,
            categoryId,
            ubicacionId,
            entradaId,
            fechaId,
            images,
            isFeatured,
            isArchived
        }=body;
        if(!userId){
            return new NextResponse("Unauthenticated",{status:403});
        }
        if(!name){
            return new NextResponse("Name is required",{status:400});
        }
        if(!entradaId){
            return new NextResponse("Entrada is required",{status:400});
        }
        if(!images || !images.length){
            return new NextResponse("Images are required",{status:400});
        }
        if(!price){
            return new NextResponse("Price is required",{status:400});
        }
        if(!categoryId){
            return new NextResponse("Category id is required",{status: 400});
        }
        if(!fechaId){
            return new NextResponse("Fecha id is required",{status:400});
        }
        if(!ubicacionId){
            return new NextResponse("Ubicacion id is rquired",{status:400});
        }
        if (!params.storeId){
            return new NextResponse("Store id is required",{status:400});
        }
        const storeByUserId= await prismadb.store.findFirst({
            where:{
                id:params.storeId,
                userId
            }
        })
        if(!storeByUserId){
            return new NextResponse("Unauthorized",{status:405});
        }
        const evento= await prismadb.evento.create({
            data:{
                name,
                price,
                entradaId,
                isFeatured,
                isArchived,
                categoryId,
                ubicacionId,
                fechaId,
                storeId: params.storeId,
                images:{
                    createMany:{
                        data:[
                            ...images.map((image:{url:string})=>image)
                        ]
                    }
                }
            }
        });
        return NextResponse.json(evento);
    }catch(error){
        console.log('[EVENTOS_POST]',error);
        return new NextResponse("Interal error",{status:500});
    }
};
export async function GET(
    req: Request,
    {params}:{params:{storeId:string}}
){
    try{
        const {searchParams} = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined 
        const ubicacionId = searchParams.get("ubicacionId") || undefined
        const entradaId = searchParams.get("ubicacionId") || undefined
        const fechaId = searchParams.get("fechaId") || undefined  
        const isFeatured = searchParams.get("isFeatured") || undefined 
        if (!params.storeId){
            return new NextResponse("El id del evento es requerido",{status:400});
        }
        const eventos = await prismadb.evento.findMany({
            where:{
                storeId: params.storeId,
                categoryId,
                ubicacionId,
                fechaId,
                isFeatured: isFeatured ? true : undefined,
                isArchived:false
            },
            include:{
                images:true,
                category:true,
                ubicacion: true,
                fecha:true
            },
            orderBy:{
                createdAt:'desc'
            }
        });
        return NextResponse.json(eventos);
    }catch(error){
        console.log('[EVENTOS_GET]',error);
        return new NextResponse("Interal error",{status:500});
    }
};