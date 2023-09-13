import prismadb from "@/lib/prismadb";
import { EventoForm } from "./components/evento-form";

const EventoPage = async ({
    params
}:{
    params:{eventoId: string,storeId:string}
}) =>{
    const evento = await prismadb.evento.findUnique({
        where:{
            id: params.eventoId
        },
        include:{
            images:true
        }
    });
    const categories = await prismadb.category.findMany({
        where:{
            storeId:params.storeId
        }
    });
    const fechas = await prismadb.fecha.findMany({
        where:{
            storeId:params.storeId,
        }
    });
    const ubicacions = await prismadb.ubicacion.findMany({
        where:{
            storeId:params.storeId,
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EventoForm initialData={evento} 
                categories={categories}
                ubicacions={ubicacions}
                fechas={fechas}
                />
            </div>
        </div>
    );
}
export default EventoPage