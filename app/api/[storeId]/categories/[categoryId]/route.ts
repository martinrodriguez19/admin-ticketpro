import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{categoryId:string}}

){
    try{

        if(!params.categoryId){
            return new NextResponse("Se requiere el ID de la categoría.", {status:400})
        }

        const category = await prismadb.category.findUnique({
            where:{
                id:params.categoryId,
            },
            include:{
                destacado:true,
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORY_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, categoryId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {name, destacadoId} = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!name){
            return new NextResponse("Se requiere una etiqueta",{status:400});
        }        
        if(!destacadoId){
            return new NextResponse("Se requiere el ID del cartel destacado",{status:400});
        }
        if(!params.categoryId){
            return new NextResponse("Se requiere el ID de la categoría", {status:400})
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
        const category = await prismadb.category.updateMany({
            where:{
                id:params.categoryId,
                
            },
            data:{
                name,
                destacadoId
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORY_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,categoryId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!params.categoryId){
            return new NextResponse("Se requiere el ID de la categoría", {status:400})
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
        const category = await prismadb.category.delete({
            where:{
                id:params.categoryId,
            }
        });
        return NextResponse.json(category);
    }catch(error){
        console.log('[CATEGORY_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};