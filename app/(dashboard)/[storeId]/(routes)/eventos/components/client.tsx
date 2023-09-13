"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { Plus } from "lucide-react";
import { useRouter,useParams } from "next/navigation";
import { EventoColumn, columns } from "./columns";
import {DataTable} from "@/components/ui/data-table"
import { ApiList } from "@/components/ui/api-list";
interface EventoClientProps{
    data:EventoColumn[]
}

export const EventoClient: React.FC<EventoClientProps> = ({
    data
}) =>{
    const router = useRouter();
    const params = useParams();
    return(
        <>
            <div className="flex items-center justify-between">
                <Heading 
                title={`Eventos(${data.length})`} 
                description="Gestionar eventos" />
                <Button onClick={()=> router.push(`/${params.storeId}/eventos/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Nuevo Evento
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data}/>
            <Heading title="API" description="API calls for Events" />
            <Separator />
            <ApiList entityName="eventos" entityIdName="eventoId"/>
        </>
    )
}