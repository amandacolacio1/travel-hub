"use client";

import { Camera } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import { Avatar, Button } from "@/shared/components/ui";
import type { PerfilFormData } from "../schemas/perfil.schema";
import { prepararFoto } from "../utils/preparar-foto";

export function FotoPerfil() {
  const { watch, setValue } = useFormContext<PerfilFormData>();
  const entrada = useRef<HTMLInputElement>(null);
  const [erro, setErro] = useState("");

  const fotoUrl = watch("fotoUrl");
  const nome = watch("nome");

  async function aoEscolher(arquivo?: File) {
    if (!arquivo) return;

    try {
      setErro("");
      const foto = await prepararFoto(arquivo);
      setValue("fotoUrl", foto, { shouldDirty: true });
    } catch (falha) {
      setErro(falha instanceof Error ? falha.message : "Imagem inválida.");
    }
  }

  return (
    <div className="flex items-center gap-stack">
      <div className="relative shrink-0">
        <Avatar src={fotoUrl} nome={nome} size="lg" />
        <button
          type="button"
          onClick={() => entrada.current?.click()}
          aria-label="Alterar foto de perfil"
          className="absolute -right-1 -bottom-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border-2 border-paper bg-brand-500 text-paper transition-colors hover:bg-brand-alt-500"
        >
          <Camera className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden />
        </button>
      </div>

      <div className="flex min-w-0 flex-col gap-inline">
        <div className="flex flex-col gap-0.5">
          <span className="font-sans text-sm font-semibold text-ink">
            Foto de perfil
          </span>
          <span className="font-sans text-xs text-text-muted-400">
            JPG, PNG ou WebP. Tamanho máximo de 10 MB.
          </span>
        </div>

        <div className="flex flex-wrap gap-inline">
          <Button
            size="sm"
            fullWidth={false}
            onClick={() => entrada.current?.click()}
          >
            Carregar imagem
          </Button>
          <Button
            size="sm"
            variant="secondary"
            fullWidth={false}
            className="border border-surface-600"
            disabled={!fotoUrl}
            onClick={() => setValue("fotoUrl", null, { shouldDirty: true })}
          >
            Remover
          </Button>
        </div>

        {erro ? (
          <p role="alert" className="font-sans text-xs text-error-500">
            {erro}
          </p>
        ) : null}
      </div>

      <input
        ref={entrada}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(evento) => {
          aoEscolher(evento.target.files?.[0]);
          // Permite escolher o mesmo arquivo de novo depois de remover.
          evento.target.value = "";
        }}
      />
    </div>
  );
}
