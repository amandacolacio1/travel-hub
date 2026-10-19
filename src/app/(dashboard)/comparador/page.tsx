import { ArrowRightLeft } from "lucide-react";
import { PagePlaceholder } from "@/features/dashboard/components/page-placeholder";

export default function ComparadorPage() {
  return (
    <PagePlaceholder
      icon={ArrowRightLeft}
      titulo="Comparador"
      descricao="Em breve você vai comparar destinos lado a lado por custo, clima e interesses."
    />
  );
}
