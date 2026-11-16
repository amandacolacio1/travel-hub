const LADO_FINAL = 256;
const TAMANHO_MAXIMO_BYTES = 10 * 1024 * 1024;
const TIPOS_ACEITOS = ["image/jpeg", "image/png", "image/webp"];

/**
 * Valida a imagem e a reduz para um quadrado de 256 px (JPEG). Assim a foto
 * cabe na sessão (~30 KB) sem precisar de storage; em produção o arquivo vai
 * para um bucket e só a URL volta para a sessão.
 */
export async function prepararFoto(arquivo: File): Promise<string> {
  if (!TIPOS_ACEITOS.includes(arquivo.type)) {
    throw new Error("Use uma imagem JPG, PNG ou WebP.");
  }
  if (arquivo.size > TAMANHO_MAXIMO_BYTES) {
    throw new Error("A imagem deve ter no máximo 10 MB.");
  }

  const bitmap = await createImageBitmap(arquivo);
  const lado = Math.min(bitmap.width, bitmap.height);

  const canvas = document.createElement("canvas");
  canvas.width = LADO_FINAL;
  canvas.height = LADO_FINAL;

  const contexto = canvas.getContext("2d");
  if (!contexto) throw new Error("Não foi possível processar a imagem.");

  // Recorte central quadrado, para qualquer proporção de entrada.
  contexto.drawImage(
    bitmap,
    (bitmap.width - lado) / 2,
    (bitmap.height - lado) / 2,
    lado,
    lado,
    0,
    0,
    LADO_FINAL,
    LADO_FINAL,
  );
  bitmap.close();

  return canvas.toDataURL("image/jpeg", 0.85);
}
