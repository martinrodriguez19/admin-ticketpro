import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { EntradaColumn } from "./components/columns"
import { EntradasClient } from "./components/client";

const EntradasPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const entradas = await prismadb.entrada.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      entradaValues: true // Incluir las EntradaValue asociadas con cada Entrada
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedEntradas: EntradaColumn[] = entradas.map((item) => {
    // Extraer y formatear los valores de las EntradaValue asociadas
    const names = item.entradaValues.map(ev => ev.names).join(', ');
    const value = item.entradaValues.map(ev => `$${ev.value}`).join(', ');
    const quantity = item.entradaValues.map(ev => ev.quantity).join(', ');

    return {
      id: item.id,
      name: item.name,
      names: names,  
      value: value, 
      quantity: quantity, 
      createdAt: format(item.createdAt, 'MMMM do, yyyy'),
    };
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EntradasClient data={formattedEntradas} />
      </div>
    </div>
  );
};

export default EntradasPage;