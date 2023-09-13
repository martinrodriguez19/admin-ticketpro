import prismadb from "@/lib/prismadb";

import { FechaForm } from "./components/fecha-form";

const FechaPage = async ({
  params
}: {
  params: { fechaId: string }
}) => {
  const fecha = await prismadb.fecha.findUnique({
    where: {
      id: params.fechaId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <FechaForm initialData={fecha} />
      </div>
    </div>
  );
}

export default FechaPage;