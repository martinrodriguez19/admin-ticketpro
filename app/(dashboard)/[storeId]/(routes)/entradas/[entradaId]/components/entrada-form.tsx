"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Entrada } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
import { InputE } from "@/components/ui/inputE"
const formSchema = z.object({
  name: z.string().min(1),
  entries: z.array(
    z.object({
      names: z.string().min(1),
      value: z.number(),
      quantity: z.number(),
    })
  ),
});


type EntradaFormValues = z.infer<typeof formSchema>;


interface EntradaFormProps {
  initialData: Entrada | null;
};

export const EntradaForm: React.FC<EntradaFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Editar entrada' : 'Crear entrada';
  const description = initialData ? 'Editar una entrada.' : 'Añadir nueva entrada';
  const toastMessage = initialData ? 'Entrada actualizada.' : 'Entrada creada.';
  const action = initialData ? 'Guardar Cambios' : 'Crear';

  const form = useForm<EntradaFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      names: [],
      value: [],
      quantity: [],
   }   
  });
  const onSubmit = async (data: EntradaFormValues) => {
    try {
      setLoading(true);
      
      // Guardar o actualizar Entrada
      let entrada;
      if (initialData) {
        entrada = await axios.patch(`/api/${params.storeId}/entradas/${params.entradaId}`, { name: data.name });
      } else {
        entrada = await axios.post(`/api/${params.storeId}/entradas`, { name: data.name });
      }
  
      // Luego, guardar o actualizar EntradaValue para cada entrada
      for (const entry of data.entries) {
        await axios.post(`/api/${params.storeId}/entradas/${entrada.data.id}/values`, entry);
      }
      
      router.refresh();
      router.push(`/${params.storeId}/entradas`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Algo salio mal.');
    } finally {
      setLoading(false);
    }
  };
  
  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/entradas/${params.entradaId}`);
      router.refresh();
      router.push(`/${params.storeId}/entradas`);
      toast.success('Entrada eliminada.');
    } catch (error: any) {
      toast.error('Asegurate de remover todos los eventos que utilicen esta entrada.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }
  const [entradas, setEntradas] = useState<Array<{ id: number }>>([{ id: Date.now() }]);

  const addEntrada = () => {
    setEntradas([...entradas, { id: Date.now() }]);
  };
  const FormEntrada: React.FC<{ uniqueId: number }> = ({ uniqueId }) => {
    return (
      <>
        <FormField
              control={form.control}
              name={`entries[${uniqueId}].names`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <InputE disabled={loading} placeholder="Preventa 1" value={field.value?.names || ''}  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`entries[${uniqueId}].value`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Precio</FormLabel>
                  <FormControl>
                    <InputE disabled={loading} placeholder="0.000" value={field.value?.value || ''}   type="number"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`entries[${uniqueId}].quantity`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cantidad</FormLabel>
                  <FormControl>
                    <InputE disabled={loading} placeholder="100" type="number" value={field.value?.quantity || ''}   {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
      </>
    )
  }

  return (
    <>
    <AlertModal 
      isOpen={open} 
      onClose={() => setOpen(false)}
      onConfirm={onDelete}
      loading={loading}
    />
     <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
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
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Evento</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Evento"  {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />          
          <div className="md:grid md:grid-cols-3 gap-8">
          {entradas.map((entrada) => (
            <FormEntrada key={entrada.id} uniqueId={entrada.id} />
          ))}
          </div>
          <button  className="ml-auto" onClick={addEntrada} >
            Añadir Nueva Entrada
          </button>          
          <br/>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};