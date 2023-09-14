"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type EntradaColumn = {
  id: string
  name: string;
  value: string;
  quantity: string; 
  createdAt: string;
}

export const columns: ColumnDef<EntradaColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "value",
    header: "Precio",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "createdAt",
    header: "Modificado",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];