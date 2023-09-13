import prismadb from "@/lib/prismadb";
import { DestacadoForm } from "./components/destacado-form";

const DestacadoPage = async ({
    params
}:{
    params:{destacadoId: string}
}) =>{
    const destacado = await prismadb.destacado.findUnique({
        where:{
            id: params.destacadoId
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <DestacadoForm initialData={destacado} />
            </div>
        </div>
    );
}
export default DestacadoPage