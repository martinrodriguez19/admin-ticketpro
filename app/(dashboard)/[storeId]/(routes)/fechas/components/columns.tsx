"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type FechaColumn = {
  id: string
  name: string;
  value: string;
  createdAt: string;
}

export const columns: ColumnDef<FechaColumn>[] = [
  {
    accessorKey: "name",
    header: "Fecha",
  },
  {
    accessorKey: "value",
    header: "Hora",
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