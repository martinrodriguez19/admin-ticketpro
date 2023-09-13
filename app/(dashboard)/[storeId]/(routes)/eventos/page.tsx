import {format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { EventoClient } from "./components/client";
import { EventoColumn } from "./components/columns";
import { formatter } from "@/lib/utils";


const EventosPage = async (
    {params}:{params:{storeId:string}}
) =>{
    const eventos = await prismadb.evento.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            category:true,
            fecha:true,
            ubicacion:true,
        },
        orderBy:{
            createdAt:'desc'
        }
    });
    const formattedEventos: EventoColumn[] = eventos.map((item)=>({
        id:item.id,
        name:item.name,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category:item.category.name,
        fecha:item.fecha.name,
        ubicacion: item.ubicacion.name,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }));
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EventoClient data={formattedEventos} />
            </div>

        </div>
    );
}
export default EventosPage;