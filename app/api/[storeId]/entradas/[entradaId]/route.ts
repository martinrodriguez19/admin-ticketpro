import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{entradaId:string}}

){
    try{

        if(!params.entradaId){
            return new NextResponse("El ID de la ubicacion es requerido", {status:400})
        }

        const entrada = await prismadb.entrada.findUnique({
            where:{
                id:params.entradaId,
            }
        });
        return NextResponse.json(entrada);
    }catch(error){
        console.log('[ENTRADA_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, entradaId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {name,value} = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }     
        if(!name){
            return new NextResponse("La entrada es requerida",{status:400});
        }
        if(!value){
            return new NextResponse("La hora es requerida",{status:400});
        }
        if(!params.entradaId){
            return new NextResponse("El ID de la entrada es requerido", {status:400})
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
        const entrada = await prismadb.entrada.update({
            where:{
                id:params.entradaId,
                
            },
            data:{
                name,
                value
            }
        });
        return NextResponse.json(entrada);
    }catch(error){
        console.log('[ENTRADA_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,entradaId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("Unauthenticated",{status:403})
        }
        if(!params.entradaId){
            return new NextResponse("El ID de la entrada es requerido", {status:400})
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
        const entrada = await prismadb.entrada.delete({
            where:{
                id:params.entradaId,
            }
        });
        return NextResponse.json(entrada);
    }catch(error){
        console.log('[ENTRADA_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};