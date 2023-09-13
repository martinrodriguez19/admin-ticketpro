"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, UbicacionColumn } from "./columns";

interface UbicacionsClientProps {
  data: UbicacionColumn[];
}

export const UbicacionsClient: React.FC<UbicacionsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Ubicaciones (${data.length})`} description="Manejar ubicaciones de tus eventos" />
        <Button onClick={() => router.push(`/${params.storeId}/ubicacions/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Ubicacion
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Llamadas API para ubicacion" />
      <Separator />
      <ApiList entityName="ubicacions" entityIdName="ubicacionId" />
    </>
  );
};