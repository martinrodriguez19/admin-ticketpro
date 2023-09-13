import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{destacadoId:string}}

){
    try{

        if(!params.destacadoId){
            return new NextResponse("Se requiere el ID del cartel destacado.", {status:400})
        }

        const destacado = await prismadb.destacado.findUnique({
            where:{
                id:params.destacadoId,
            }
        });
        return NextResponse.json(destacado);
    }catch(error){
        console.log('[DESTACADO_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, destacadoId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {label,imageUrl} = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!label){
            return new NextResponse("Se requiere una etiqueta",{status:400});
        }        
        if(!imageUrl){
            return new NextResponse(" Se requiere la URL de la imagen",{status:400});
        }
        if(!params.destacadoId){
            return new NextResponse("Se requiere el ID del cartel destacado", {status:400})
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
        const destacado = await prismadb.destacado.update({
            where:{
                id:params.destacadoId,
                
            },
            data:{
                label,
                imageUrl
            }
        });
        return NextResponse.json(destacado);
    }catch(error){
        console.log('[DESTACADO_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,destacadoId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!params.destacadoId){
            return new NextResponse("Se requiere el ID del cartel destacado.", {status:400})
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
        const destacado = await prismadb.destacado.delete({
            where:{
                id:params.destacadoId,
            }
        });
        return NextResponse.json(destacado);
    }catch(error){
        console.log('[DESTACADO_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};