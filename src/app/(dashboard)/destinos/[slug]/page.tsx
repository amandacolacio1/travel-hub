import { DestinoDetalheView } from "@/features/destinos/components/destino-detalhe-view";

type DestinoPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function DestinoPage({ params }: DestinoPageProps) {
  const { slug } = await params;

  return <DestinoDetalheView slug={slug} />;
}
