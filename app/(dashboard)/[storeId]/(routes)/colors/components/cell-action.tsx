"use client";

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,   DropdownMenuLabel, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { ColorColumn } from "./columns";
import { Button } from "@/components/ui/button";
import { Copy, Edit, MoreHorizontal ,Trash} from "lucide-react";
import axios from "axios";

import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AlertModal } from "@/components/modals/alert-modal";
interface CellActionProps{
    data:ColorColumn;

};
export const CellAction: React.FC<CellActionProps> = ({
    data,
}) =>{
    const router= useRouter();
    const params = useParams();
    const [loading,setLoading] = useState(false);
    const [open,setOpen] = useState(false);


    const onCopy = (id:string) =>{
        navigator.clipboard.writeText(id);
        toast.success("El ID de la ubicacion ha sido copiado al portapapeles.")
    }
    const onConfirm = async () =>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/colors/${data.id}`);
            router.refresh();
            toast.success("Ubicacion eliminada.");
        } catch (error){
            toast.error("Asegúrate de haber eliminado todos los eventos que utilizan esta ubicacion primero.")
        }finally{
            setLoading(false)
            setOpen(false)
        }
    }
    return(
        <>
            <AlertModal 
            isOpen={open}
            onClose={()=>setOpen(false)}
            onConfirm={onConfirm}
            loading={loading}
            />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">
                            Abrir Menu
                        </span>
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        Acciones
                    </DropdownMenuLabel>
                    <DropdownMenuItem onClick={()=>onCopy(data.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        Copiar ID
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>router.push(`/${params.storeId}/colors/${data.id}`)}>
                        <Edit className="mr-2 h-4 w-4" />
                        Actualizar
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={()=>setOpen(true)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>  
            </DropdownMenu>
        </>
    );
};