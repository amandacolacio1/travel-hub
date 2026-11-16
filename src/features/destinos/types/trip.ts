/** Etapa da viagem. Só as `planejando` contam para o limite da lista. */
export type TripStatus = "planejando" | "escolhida" | "realizada";

/** Uma viagem de "Meus destinos", como o `GET /api/viagens` devolve. */
export type Trip = {
  id: string;
  status: TripStatus;
  /** `"2026-12-01"`, ou vazio quando ainda não há data. */
  dataPrevista: string;
  /** ISO 8601. */
  criadoEm: string;
  destino: {
    codigoPais: string;
    pais: string;
    cidade: string;
  };
};
