import { MapPin } from "lucide-react";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export default function DestinosPage() {
  return (
    <PagePlaceholder
      icon={MapPin}
      titulo="Destinos"
      descricao="Em breve você vai salvar e organizar os destinos que mais combinam com você."
    />
  );
}
