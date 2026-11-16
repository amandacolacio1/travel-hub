import "server-only";

export type UsuarioArmazenado = {
  id: string;
  nome: string;
  email: string;
  /** `salt:hash` gerado por `gerarHashDeSenha`. Nunca a senha em texto puro. */
  senhaHash: string;
};

/**
 * Substitui o banco enquanto ele não existe. Mora apenas no servidor, então o
 * hash nunca chega ao bundle do cliente.
 *
 * Hash correspondente à senha de teste `12345678`.
 */
export const USUARIOS_MOCK: UsuarioArmazenado[] = [
  {
    id: "3f8c1d2e-5a4b-4c7d-9e0f-1a2b3c4d5e6f",
    nome: "Amanda",
    email: "amanda@travelhub.com",
    senhaHash:
      "a153efe21ca65f752dfaa4764d12dc73:1ba8beee4ca2c120bfad0dfce3d8865910ba9ae2cb4a802bee0db426f748f23dc223bfdacc2041368f18d657a3ec8d8d496d73e529792e9087c3e24f49b26f24",
  },
];

export function buscarUsuarioPorEmail(
  email: string,
): UsuarioArmazenado | undefined {
  const normalizado = email.trim().toLowerCase();
  return USUARIOS_MOCK.find((usuario) => usuario.email === normalizado);
}

export function buscarUsuarioPorId(id: string): UsuarioArmazenado | undefined {
  return USUARIOS_MOCK.find((usuario) => usuario.id === id);
}
