import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { FechaColumn } from "./components/columns"
import { FechasClient } from "./components/client";

const FechasPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const fechas = await prismadb.fecha.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedFechas: FechaColumn[] = fechas.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FechasClient data={formattedFechas} />
      </div>
    </div>
  );
};

export default FechasPage;