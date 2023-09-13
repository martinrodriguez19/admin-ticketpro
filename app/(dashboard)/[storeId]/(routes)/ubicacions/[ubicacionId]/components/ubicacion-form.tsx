"use client"

import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Ubicacion } from "@prisma/client"
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

const formSchema = z.object({
  name: z.string().min(1),
  value: z.string().url(),
});

type UbicacionFormValues = z.infer<typeof formSchema>

interface UbicacionFormProps {
  initialData: Ubicacion | null;
};

export const UbicacionForm: React.FC<UbicacionFormProps> = ({
  initialData
}) => {
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Editar ubicacion' : 'Crear ubicacion';
  const description = initialData ? 'Editar una ubicacion.' : 'Añadir nueva ubicacion';
  const toastMessage = initialData ? 'Ubicacion actualizada.' : 'Ubicacion creada.';
  const action = initialData ? 'Guardar Cambios' : 'Crear';

  const form = useForm<UbicacionFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: ''
    }
  });

  const onSubmit = async (data: UbicacionFormValues) => {
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/ubicacions/${params.ubicacionId}`, data);
      } else {
        await axios.post(`/api/${params.storeId}/ubicacions`, data);
      }
      router.refresh();
      router.push(`/${params.storeId}/ubicacions`);
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
      await axios.delete(`/api/${params.storeId}/ubicacions/${params.ubicacionId}`);
      router.refresh();
      router.push(`/${params.storeId}/ubicacions`);
      toast.success('Ubicacion eliminada.');
    } catch (error: any) {
      toast.error('Asegurate de remover todos los eventos que utilicen esta ubicacion.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
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
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicacion</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Ubicacion" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="https://www.google.com/maps"  type="url" {...field} />
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
  );
};