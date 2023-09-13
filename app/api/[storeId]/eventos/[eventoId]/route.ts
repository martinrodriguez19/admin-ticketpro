import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs";
export async function GET (
    req: Request,
    {params}:{params:{eventoId:string}}

){
    try{

        if(!params.eventoId){
            return new NextResponse("Evento id is required", {status:400})
        }

        const evento = await prismadb.evento.findUnique({
            where:{
                id:params.eventoId,
            },
            include:{
                images:true,
                category:true,
                fecha:true,
                ubicacion:true,
            }
        });
        return NextResponse.json(evento);
    }catch(error){
        console.log('[EVENTO_GET]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function PATCH (
    req: Request,
    {params}:{params:{storeId:string, eventoId:string}}

){
    try{
        const {userId} = auth();
        const body= await req.json();
        const {
            name,
            price,
            categoryId,
            ubicacionId,
            fechaId,
            images,
            isFeatured,
            isArchived
        } = body;
        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!name){
            return new NextResponse("El nombre es requerido",{status:400});
        }
        if(!images || !images.length){
            return new NextResponse("Las imagenes son requeridas",{status:400});
        }
        if(!price){
            return new NextResponse("El precio es requerido",{status:400});
        }
        if(!categoryId){
            return new NextResponse("El id de la categoria es requerido",{status: 400});
        }
        if(!fechaId){
            return new NextResponse("El ID de la fecha es requerido",{status:400});
        }
        if(!ubicacionId){
            return new NextResponse("El ID de la ubicacion es requerido",{status:400});
        }
        if(!params.eventoId){
            return new NextResponse("El ID del cartel destacado es requerido", {status:400})
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
        await prismadb.evento.update({
            where:{
                id:params.eventoId,
                
            },
            data:{
                name,
                price,
                categoryId,
                ubicacionId,
                fechaId,
                images:{
                    deleteMany:{}
                },
                isFeatured,
                isArchived,
            }
        });
            const evento = await prismadb.evento.update({
                where:{
                    id:params.eventoId
                },
                data:{
                    images:{
                        createMany:{
                            data:[
                                ...images.map((image:{url:string})=>image),
                            ]
                        }
                    }
                }
            })

        return NextResponse.json(evento);
    }catch(error){
        console.log('[EVENTO_PATCH]',error);
        return new NextResponse("Internal error",{status:500});
    }
};
export async function DELETE (
    req: Request,
    {params}:{params:{storeId:string,eventoId:string}}

){
    try{
        const {userId} = auth();

        if(!userId){
            return new NextResponse("No autenticado",{status:403})
        }
        if(!params.eventoId){
            return new NextResponse("El ID del evento es requerido", {status:400})
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
        const evento = await prismadb.evento.delete({
            where:{
                id:params.eventoId,
            }
        });
        return NextResponse.json(evento);
    }catch(error){
        console.log('[EVENTO_DELETE]',error);
        return new NextResponse("Internal error",{status:500});
    }
};