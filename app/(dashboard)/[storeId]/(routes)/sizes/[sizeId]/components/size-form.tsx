"use client";
import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import { Size} from "@prisma/client";
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";

const formSchema = z.object({
    name: z.string().min(1),
    value: z.string().min(1),
});

type SizesFormValues = z.infer<typeof formSchema>;
interface SizesFormProps{
    initialData: Size | null;
}

export const SizesForm:React.FC<SizesFormProps> = ({
    initialData
}) =>{
    const params = useParams();
    const router = useRouter();

    const [open,setOpen]=useState(false);
    const [loading,setLoading] = useState(false);
    const title = initialData ? "Editar fecha" : "Crear fecha";
    const description = initialData ? "Editar fecha" : "Añadir nueva fecha";
    const toastMessage = initialData ? "Fecha actualizada" : "Fecha creada.";
    const action = initialData ? "Guardar cambios" : "Crear";
    const form = useForm<SizesFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData || {
            name:'',
            value:''
        }
    });
    const onSubmit = async (data:SizesFormValues)=>{
        try{
        setLoading(true);
        if(initialData){
            await axios.patch(`/api/${params.storeId}/sizes/${params.sizeId}`,data);            
        } else{
            await axios.post(`/api/${params.storeId}/sizes`,data);      
        }
        router.refresh();
        router.push(`/${params.storeId}/sizes`)
        toast.success(toastMessage);
        }catch(error){
            toast.error("Algo salio mal.")
        }finally{
            setLoading(false)
        }
    };
    const onDelete = async ()=>{
        try{
            setLoading(true)
            await axios.delete(`/api/${params.storeId}/sizes/${params.sizeId}`)
            router.refresh();
            router.push(`/${params.storeId}/sizes`)
            toast.success("Fecha eliminada.");
        } catch(error){
            toast.error("Asegúrate de haber eliminado todos los eventos que utilizan esta fecha primero.")
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
        onConfirm={onDelete}
        loading={loading}
        />
        <div className="flex items-center justify-between">
            <Heading 
            title={title}
            description={description}
            />
            {initialData && (
                <Button
                    disabled={loading}
                    variant="destructive"
                    size="sm"
                    onClick={()=>setOpen(true)}
                >
                    <Trash className="h-4 w-4" />
                </Button>
    )}
        </div>
        <Separator />
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">

                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Fecha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="value"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Mes</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Mes" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                </div>
                <Button disabled={loading} className="ml-auto" type="submit">
                    {action}
                </Button>
            </form>
        </Form>


        </>
    )
}