import { UserCog } from "lucide-react";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export default function PerfilPage() {
  return (
    <PagePlaceholder
      icon={UserCog}
      titulo="Editar perfil"
      descricao="Em breve você vai atualizar sua foto, seus dados e suas preferências por aqui."
    />
  );
}
