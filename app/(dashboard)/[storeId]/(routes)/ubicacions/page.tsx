import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { UbicacionColumn } from "./components/columns"
import { UbicacionsClient } from "./components/client";

const UbicacionsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const ubicacions = await prismadb.ubicacion.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedUbicacions: UbicacionColumn[] = ubicacions.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UbicacionsClient data={formattedUbicacions} />
      </div>
    </div>
  );
};

export default UbicacionsPage;