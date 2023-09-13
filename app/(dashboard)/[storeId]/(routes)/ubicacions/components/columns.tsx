"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type UbicacionColumn = {
  id: string
  name: string;
  value: string;
  createdAt: string;
}

export const columns: ColumnDef<UbicacionColumn>[] = [
  {
    accessorKey: "name",
    header: "Ubicacion",
  },
  {
    accessorKey: "value",
    header: "Link",
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