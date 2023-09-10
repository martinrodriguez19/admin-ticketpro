"use client"

import { ColumnDef } from "@tanstack/react-table"

export type OrderColumn = {
  id: string;
  phone: string;
  address:string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
}

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: "products",
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
