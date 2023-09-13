"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, FechaColumn } from "./columns";

interface FechasClientProps {
  data: FechaColumn[];
}

export const FechasClient: React.FC<FechasClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Fechas (${data.length})`} description="Manejar fechas de tus eventos" />
        <Button onClick={() => router.push(`/${params.storeId}/fechas/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Fecha
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Llamadas API para fecha" />
      <Separator />
      <ApiList entityName="fechas" entityIdName="fechaId" />
    </>
  );
};