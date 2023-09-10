"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter,useParams } from "next/navigation";
import { ColorColumn, columns } from "./columns";
import {DataTable} from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list";
interface ColorsClientProps{
    data:ColorColumn[]
}

export const ColorsClient: React.FC<ColorsClientProps> = ({
    data
}) =>{
    const router = useRouter();
    const params = useParams();
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading title={`Ubicacion(${data.length})`} 
                description="Gestionar ubicaciones para tu evento."/>
                <Button onClick={()=> router.push(`/${params.storeId}/colors/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nueva Ubicacion
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="Llamadas a la API para ubicaciones." />
            <Separator />
            <ApiList entityName="colors" entityIdName="colorId"/>
        </>
    )
}