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
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedEntradas: EntradaColumn[] = entradas.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    quantity: item.quantity,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <EntradasClient data={formattedEntradas} />
      </div>
    </div>
  );
};

export default EntradasPage;