"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  phone: string;
  address:string;
  isPaid: boolean;
  totalPrice: string;
  eventos: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "eventos",
    header: "Evento",
  },
  {
    accessorKey: "phone",
    header: "Telefono",
  },
  {
    accessorKey: "address",
    header: "Direccion",
  },
  {
    accessorKey: "totalPrice",
    header: "Precio total ",
  },
  {
    accessorKey: "isPaid",
    header: "Pagado",
  },
]
