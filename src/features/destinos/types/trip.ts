/** Etapa da viagem. Só as `planejando` contam para o limite da lista. */
export type TripStatus = "planejando" | "escolhida" | "realizada";

/** Situação da ficha do destino (gerada uma vez por cidade, por IA ou não). */
export type ProfileStatus = "pendente" | "gerando" | "pronta" | "erro";

/** Uma viagem de "Meus destinos", como o `GET /api/viagens` devolve. */
export type Trip = {
  id: string;
  status: TripStatus;
  /** `"2026-12-01"`, ou vazio quando ainda não há data. */
  dataPrevista: string;
  /** ISO 8601. */
  criadoEm: string;
  destino: {
    slug: string;
    /** Sigla do estado, ex.: "BA". */
    uf: string;
    estado: string;
    cidade: string;
    fichaStatus: ProfileStatus;
  };
};
