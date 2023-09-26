import prismadb from "@/lib/prismadb";
import { EntradaForm } from "./components/entrada-form";

const EntradaPage = async ({
    params
}:{
    params:{entradaId: string}
}) =>{
    const entrada = await prismadb.entrada.findUnique({
        where:{
            id: params.entradaId
        },
        include: {
            entradaValues: true
        }
    });
    return(
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <EntradaForm initialData={entrada} />
            </div>
        </div>
    );
}
export default EntradaPage