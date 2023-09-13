import {format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { DestacadoClient } from "./components/client";
import { DestacadoColumn } from "./components/columns";


const DestacadosPage = async (
    {params}:{params:{storeId:string}}
) =>{
    const destacados = await prismadb.destacado.findMany({
        where:{
            storeId:params.storeId
        },
        orderBy:{
            createdAt:'desc'
        }
    });
    const formattedDestacados: DestacadoColumn[]=destacados.map((item)=>({
        id:item.id,
        label:item.label,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DestacadoClient data={formattedDestacados} />
            </div>

        </div>
    );
}
export default DestacadosPage;