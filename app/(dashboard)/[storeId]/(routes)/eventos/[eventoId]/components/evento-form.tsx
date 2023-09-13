"use client";
import axios from "axios";
import * as z from "zod";
import { useState } from "react";
import {Category, Image, Evento, Ubicacion, Fecha} from "@prisma/client";
import {Heading} from "@/components/ui/heading";
import {Button} from "@/components/ui/button";
import { Trash } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import { AlertModal } from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { Select,SelectTrigger,SelectValue,SelectContent,SelectItem } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
    name: z.string().min(1),
    images: z.object({url:z.string()}).array(),
    price: z.coerce.number().min(1),
    categoryId: z.string().min(1),
    ubicacionId:z.string().min(1),
    fechaId: z.string().min(1),
    isFeatured: z.boolean().default(false).optional(),
    isArchived: z.boolean().default(false).optional(),
});

type EventoFormValues = z.infer<typeof formSchema>;
interface EventoFormProps{
    initialData: Evento & {
        images: Image[]
    } | null;
    categories:Category[];
    ubicacions:Ubicacion[];
    fechas:Fecha[];
}

export const EventoForm:React.FC<EventoFormProps> = ({
    initialData,
    categories,
    ubicacions,
    fechas,
}) =>{
    const params = useParams();
    const router = useRouter();

    const [open,setOpen]=useState(false);
    const [loading,setLoading] = useState(false);
    const title = initialData ? "Editar evento" : "Crear evento";
    const description = initialData ? "Editar evento" : "Nuevo evento";
    const toastMessage = initialData ? "Evento actualizado" : "Evento creado.";
    const action = initialData ? "Guardar cambios" : "Crear";
    const form = useForm<EventoFormValues>({
        resolver:zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
            price:parseFloat(String(initialData?.price))
        } : {
            name:'',
            images:[],
            price:0,
            categoryId:'',
            ubicacionId:'',
            fechaId:'',
            isFeatured:false,
            isArchived: false,
        }
    });
    const onSubmit = async (data:EventoFormValues)=>{
        try{
        setLoading(true);
        if(initialData){
            await axios.patch(`/api/${params.storeId}/eventos/${params.eventoId}`,data);            
        } else{
            await axios.post(`/api/${params.storeId}/eventos`,data);      
        }
        router.refresh();
        router.push(`/${params.storeId}/eventos`)
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
            await axios.delete(`/api/${params.storeId}/eventos/${params.eventoId}`)
            router.refresh();
            router.push(`/${params.storeId}/eventos`)
            toast.success("Evento eliminado.");
        } catch(error){
            toast.error("Algo salio mal.")
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
                    name="images"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Imagenes</FormLabel>
                            <FormControl>
                                <ImageUpload
                                value={field.value.map((image)=>image.url)}
                                disabled={loading}
                                onChange={(url)=>field.onChange([...field.value,{url}])}
                                onRemove={(url)=>field.onChange([...field.value.filter((current)=>current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <div className="grid grid-cols-3 gap-8">
                    <FormField
                    control={form.control}
                    name="name"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl>
                                <Input disabled={loading} placeholder="Nombre del evento" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="price"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Precio</FormLabel>
                            <FormControl>
                                <Input type="number" disabled={loading} placeholder="0.00" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="categoryId"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Categoria</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                      <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona una categoria"
                                      /> 
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories.map((category)=>(
                                        <SelectItem
                                        key={category.id}
                                        value={category.id}
                                        >
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                                        <FormField
                    control={form.control}
                    name="fechaId"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                      <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona una fecha"
                                      /> 
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {fechas.map((fecha)=>(
                                        <SelectItem
                                        key={fecha.id}
                                        value={fecha.id}
                                        >
                                            {fecha.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="ubicacionId"
                    render={({field})=>(
                        <FormItem>
                            <FormLabel>Ubicacion</FormLabel>
                            <Select disabled={loading} onValueChange={field.onChange} value={field.value} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                      <SelectValue 
                                        defaultValue={field.value}
                                        placeholder="Selecciona una ubicacion"
                                      /> 
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {ubicacions.map((ubicacion)=>(
                                        <SelectItem
                                        key={ubicacion.id}
                                        value={ubicacion.id}
                                        >
                                            {ubicacion.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="isFeatured"
                    render={({field})=>(
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Destacado
                                </FormLabel>
                                <FormDescription>
                                Este evento aparecerá en la página de inicio.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="isArchived"
                    render={({field})=>(
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox 
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>
                                    Archivado
                                </FormLabel>
                                <FormDescription>            
                                    Este evento no aparecerá en ninguna parte de la tienda.
                                </FormDescription>
                            </div>
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