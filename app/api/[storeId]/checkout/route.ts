import { NextResponse } from "next/server";
import mercadopago from "mercadopago"; // Asegúrate de importar la biblioteca de MercadoPago adecuadamente
import prismadb from "@/lib/prismadb";

// Configura las credenciales de MercadoPago (reemplaza con tus propias credenciales)
mercadopago.configure({
    access_token: process.env.MERCADOPAGO_ACCESS_TOKEN
});

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();
  if (!productIds || productIds.length === 0) {
    return new NextResponse("Se requieren los IDs de los eventos.", { status: 400 });
  }
  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
  });

  const items = products.map((product) => ({
    title: product.name,
    unit_price: product.price.toNumber(),
    quantity: 1,
  }));

  const preference = {
    items,
    back_urls: {
      success: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
      pending: `${process.env.FRONTEND_STORE_URL}/cart?pending=1`,
      failure: `${process.env.FRONTEND_STORE_URL}/cart?failure=1`,
    },
    auto_return: "approved", // Define el comportamiento de retorno automático
    external_reference: "orderId", // Reemplaza con el identificador de tu pedido
  };

  try {
    const response = await mercadopago.preferences.create(preference);

    return NextResponse.json({ url: response.body.init_point }, {
      headers: corsHeaders,
    });
  } catch (error) {
    return new NextResponse("Error creating MercadoPago preference", {
      status: 500,
    });
  }
}
