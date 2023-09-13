"use client";
import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import { Destacado, Category} from "@prisma/client";
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
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";


const formSchema = z.object({
    name: z.string().min(1),
    destacadoId: z.string().min(1),
});

type CategoryFormValues = z.infer<typeof formSchema>;
interface CategoryFormProps{
    initialData: Category | null;
    destacados: Destacado[];
}

export const CategoryForm:React.FC<CategoryFormProps> = ({
    initialData,
    destacados
}) =>{
    const params = useParams();
    const router = useRouter();

    const [open,setOpen]=useState(false);
    const [loading,setLoading] = useState(false);
    const title = initialData ? "Editar categoria" : "Crear categoria";
    const description = initialData ? "Editar categoria" : "Nueva categoria";
    const toastMessage = initialData ? "Categoria actualizada" : "Categoria creada.";
    const action = initialData ? "Guardar Cambios" : "Crear";
    const form = useForm<CategoryFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData || {
            name:'',
            destacadoId:''
        }
    });
    const onSubmit = async (data:CategoryFormValues)=>{
        try{
        setLoading(true);
        if(initialData){
            await axios.patch(`/api/${params.storeId}/categories/${params.categoryId}`,data);            
        } else{
            await axios.post(`/api/${params.storeId}/categories`,data);      
        }
        router.refresh();
        router.push(`/${params.storeId}/categories`)
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
            await axios.delete(`/api/${params.storeId}/categories/${params.categoryId}`)
            router.refresh();
            router.push(`/${params.storeId}/categories`)
            toast.success("Category deleted.");
        } catch(error){
            toast.error("Asegúrate de haber eliminado todos los eventos que utilizan esta categoría primero.")
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
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Nombre de la categoria" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="destacadoId"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Destacado</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                      <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona un destacado"
                                      /> 
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {destacados.map((destacado)=>(
                                        <SelectItem
                                        key={destacado.id}
                                        value={destacado.id}
                                        >
                                            {destacado.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
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