"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

export type CategoryColumn = {
  id: string
  name: string
  billboardLabel:string
  createdAt: string;
}

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: "name",
    header: "Nombre",
  },
  {
    accessorKey: "billboard",
    header: "Destacado",
    cell:({row})=>row.original.billboardLabel,
  },
  {
    accessorKey:"createdAt",
    header:"Creado",
  },
    {
        id:"actions",
        cell:({row})=><CellAction data={row.original} />
    }
]