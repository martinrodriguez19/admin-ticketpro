"use client";
import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import {Billboard} from "@prisma/client";
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
    label: z.string().min(1),
    imageUrl: z.string().min(1),
});

type BillboardFormValues = z.infer<typeof formSchema>;
interface BillboardFormProps{
    initialData: Billboard | null;
}

export const BillboardForm:React.FC<BillboardFormProps> = ({
    initialData
}) =>{
    const params = useParams();
    const router = useRouter();

    const [open,setOpen]=useState(false);
    const [loading,setLoading] = useState(false);
    const title = initialData ? "Edit Destacado" : "Crear Destacado";
    const description = initialData ? "Editar Destacado" : "Añadir destacado";
    const toastMessage = initialData ? "Destacado actualizado" : "Destacado creado.";
    const action = initialData ? "Guardar Cambios" : "Crear";
    const form = useForm<BillboardFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData || {
            label:'',
            imageUrl:''
        }
    });
    const onSubmit = async (data:BillboardFormValues)=>{
        try{
        setLoading(true);
        if(initialData){
            await axios.patch(`/api/${params.storeId}/billboards/${params.billboardId}`,data);            
        } else{
            await axios.post(`/api/${params.storeId}/billboards`,data);      
        }
        router.refresh();
        router.push(`/${params.storeId}/billboards`)
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
            await axios.delete(`/api/${params.storeId}/billboards/${params.billboardId}`)
            router.refresh();
            router.push(`/${params.storeId}/billboards`)
            toast.success("Destacado eliminado.");
        } catch(error){
            toast.error("Asegúrate de haber eliminado todas las categorías que utilizan este cartel destacado primero.")
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
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Background Image</FormLabel>
                            <FormControl>
                                <ImageUpload
                                value={field.value?[field.value]:[]}
                                disabled={loading}
                                onChange={(url)=>field.onChange(url)}
                                onRemove={()=>field.onChange("")}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name="label"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Label</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Billboard Label" {...field} />
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