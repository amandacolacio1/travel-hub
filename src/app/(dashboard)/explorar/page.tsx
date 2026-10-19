import { Compass } from "lucide-react";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export default function ExplorarPage() {
  return (
    <PagePlaceholder
      icon={Compass}
      titulo="Explorar"
      descricao="Em breve você vai navegar por destinos sugeridos a partir das suas preferências."
    />
  );
}
