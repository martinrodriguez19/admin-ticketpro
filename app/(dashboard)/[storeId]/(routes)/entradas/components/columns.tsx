"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"

export type EntradaColumn = {
  id: string;
  name: string;
  names: string[]; // ahora es un array
  value: number[]; // ahora es un array
  quantity: number[]; // ahora es un array
  createdAt: string;
};
// ...

export const columns: ColumnDef<EntradaColumn>[] = [
  {
    accessorKey: "name",
    header: "Evento",
  },
  {
    accessorKey: "names",
    header: "Nombre",
    cell: ({ value }) => value.join(', ') // une los nombres con comas
  },
  {
    accessorKey: "value",
    header: "Precio",
    cell: ({ value }) => value.join(', ') // une los precios con comas
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
    cell: ({ value }) => value.join(', ') // une las cantidades con comas
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
