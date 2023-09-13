"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type EventoColumn = {
  id: string;
  name: string;
  price: string;
  fecha:string;
  category: string;
  ubicacion: string;
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;

}

export const columns: ColumnDef<EventoColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey:"isArchived",
    header:"Archivado",
  },
  {
    accessorKey:"isFeatured",
    header:"Destacado"
  },
  {
    accessorKey:"price",
    header:"Precio",
  },
  {
    accessorKey:"category",
    header:"Categoria",
  },
  {
    accessorKey:"fecha",
    header:"Fecha",
  },
  {
    accessorKey:"ubicacion",
    header:"Ubicacion",
  },
  {
    accessorKey: "createdAt",
    header: "Creado",
  },
    {
        id:"actions",
        cell:({row})=><CellAction data={row.original} />
    }
]
