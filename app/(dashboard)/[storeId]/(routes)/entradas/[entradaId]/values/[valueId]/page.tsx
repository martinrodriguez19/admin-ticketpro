import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useParams } from "next/navigation";
import * as z from "zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const valueSchema = z.object({
  name: z.string().min(1),
  value: z.number(),
  quantity: z.number(),
});

type EntradaValueFormValues = z.infer<typeof valueSchema>;

export default function EditEntradaValue() {
  const { storeId, entradaId, valueId } = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<EntradaValueFormValues | null>(null);

  const form = useForm<EntradaValueFormValues>({
    resolver: zodResolver(valueSchema),
    defaultValues: initialData || {
      name: "",
      value: 0,
      quantity: 0,
    },
  });

  useEffect(() => {
    // Obtener los datos iniciales para la entradaValue
    async function fetchData() {
      try {
        const response = await axios.get(`/api/${storeId}/entradas/${entradaId}/values/${valueId}`);
        setInitialData(response.data);
      } catch (error) {
        toast.error("Error cargando datos.");
      }
    }

    fetchData();
  }, [storeId, entradaId, valueId]);

  const onSubmit = async (data: EntradaValueFormValues) => {
    try {
      setLoading(true);
      await axios.patch(`/api/${storeId}/entradas/${entradaId}/values/${valueId}`, data);
      router.back();
      toast.success("EntradaValue actualizada.");
    } catch (error) {
      toast.error("Error al actualizar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Editar EntradaValue</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Nombre de la entrada" {...field} />
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
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Valor" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quantity"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input disabled={loading} placeholder="Cantidad" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={loading} type="submit">
            Actualizar
          </Button>
        </form>
      </Form>
    </div>
  );
}