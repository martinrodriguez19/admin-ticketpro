"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter,useParams } from "next/navigation";
import { DestacadoColumn, columns } from "./columns";
import {DataTable} from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list";
interface DestacadoClientProps{
    data:DestacadoColumn[]
}

export const DestacadoClient: React.FC<DestacadoClientProps> = ({
    data
}) =>{
    const router = useRouter();
    const params = useParams();
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Destacado(${data.length})`} 
                description="Gestionar carteles destacados"/>
                <Button onClick={()=> router.push(`/${params.storeId}/destacados/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Destacado
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="label" columns={columns} data={data}/>
            <Heading title="API" description="Llamadas a la API para Carteles Destacados" />
            <Separator />
            <ApiList entityName="destacados" entityIdName="destacadoId"/>
        </>
    )
}