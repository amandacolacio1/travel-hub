import { z } from "zod";

/** Id do passeio na fonte. Só o id: o servidor busca o resto na própria fonte. */
export const tourApiIdSchema = z.string().trim().min(1).max(120);

/** Corpo do `POST /api/passeios-salvos`. */
export const saveTourSchema = z.object({ apiId: tourApiIdSchema });
