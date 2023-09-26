"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { columns, EntradaColumn } from "./columns";

interface EntradasClientProps {
  data: EntradaColumn[];
}

export const EntradasClient: React.FC<EntradasClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
  
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={`Entradas (${data.length})`} description="Manejar entradas de tus eventos" />
        <Button onClick={() => router.push(`/${params.storeId}/entradas/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Nueva Entrada
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="Llamadas API para entrada" />
      <Separator />
      <ApiList entityName="entradas" entityIdName="entradaId" />
    </>
  );
};
