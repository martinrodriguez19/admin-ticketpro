"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type DestacadoColumn = {
  id: string
  label: string
  createdAt: string;
}

export const columns: ColumnDef<DestacadoColumn>[] = [
  {
    accessorKey: "label",
    header: "Etiqueta",
  },
  {
    accessorKey: "createdAt",
    header: "Datos",
  },
    {
        id:"actions",
        cell:({row})=><CellAction data={row.original} />
    }
]
