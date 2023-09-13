import prismadb from "@/lib/prismadb";

import { UbicacionForm } from "./components/ubicacion-form";

const UbicacionPage = async ({
  params
}: {
  params: { ubicacionId: string }
}) => {
  const ubicacion = await prismadb.ubicacion.findUnique({
    where: {
      id: params.ubicacionId
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UbicacionForm initialData={ubicacion} />
      </div>
    </div>
  );
}

export default UbicacionPage;