import {format } from "date-fns";
import prismadb from "@/lib/prismadb";
import { OrderClient } from "./components/client";
import { OrderColumn } from "./components/columns";
import { formatter } from "@/lib/utils";


const OrdersPage = async (
    {params}:{params:{storeId:string}}
) =>{
    const orders = await prismadb.order.findMany({
        where:{
            storeId:params.storeId
        },
        include:{
            orderItems:{
                include:{
                    evento:true
                }
            }
        },
        orderBy:{
            createdAt:'desc'
        }
    });
    const formattedOrders: OrderColumn[]=orders.map((item)=>({
        id:item.id,
        phone: item.phone,
        address: item.address,
        eventos: item.orderItems.map((orderItem)=> orderItem.evento.name).join(', '),
        totalPrice: formatter.format(item.orderItems.reduce((total,item)=>{
            return total + Number(item.evento.price)
        },0)),
        isPaid:item.isPaid,
        createdAt: format(item.createdAt,"MMMM do, yyyy")
    }))
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <OrderClient data={formattedOrders} />
            </div>

        </div>
    );
}
export default OrdersPage;