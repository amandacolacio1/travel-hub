"use client";

import { useState } from "react";
import { Button, CurrencyInput, Input, Select } from "@/shared/components/ui";
import { INTERESSES } from "../constants/interesses";
import { PERFIS_VIAGEM } from "../constants/perfis-viagem";
import { DESTINOS } from "../constants/destinos";
import type { PerfilViagem } from "../types/auth";
import { AuthIcon } from "./auth-icon";
import { InterestCard } from "./interest-card";
import { ProfileCard } from "./profile-card";
import { SocialAuth } from "./social-auth";
import { StepIndicator } from "./step-indicator";

export function ComponentsShowcase() {
  const [step, setStep] = useState(1);
  const [interesses, setInteresses] = useState<string[]>(["natureza"]);
  const [perfil, setPerfil] = useState<PerfilViagem>("sozinho");
  const [orcamento, setOrcamento] = useState(8000);
  const [pais, setPais] = useState("Brasil");

  const cidades =
    DESTINOS.find((item) => item.nome === pais)?.cidades.map((cidade) => ({
      value: cidade,
      label: cidade,
    })) ?? [];

  function toggleInteresse(id: string) {
    setInteresses((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <header>
        <p className="text-[11px] font-medium tracking-[0.14em] text-text-muted-400 uppercase">
          Design system
        </p>
        <h1 className="mt-2 text-4xl text-ink">Componentes</h1>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-text-muted-400">
          Biblioteca visual do Travel Hub. Títulos em Fraunces, interface em
          Inter.
        </p>
      </header>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-ink">Tipografia</h2>
        <div className="rounded-xl border border-surface-600 bg-paper p-5">
          <p className="font-serif text-3xl text-ink">Fraunces — títulos</p>
          <p className="mt-2 text-sm text-text-muted-500">
            Inter — corpo, labels e ações. Usada em todo o restante da
            interface.
          </p>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-ink">Botões</h2>
        <div className="flex flex-col gap-3">
          <Button variant="primary">
            Primário
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>
          <Button variant="primary" disabled>
            Primário disabled
            <AuthIcon name="arrow" className="h-4 w-4" />
          </Button>
          <Button variant="secondary">Secundário</Button>
          <Button variant="secondary" disabled>
            Secundário disabled
          </Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="ghost" disabled>
            Ghost disabled
          </Button>
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-ink">Campos</h2>
        <Input label="Nome completo" placeholder="Como deseja ser chamado?" />
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          error="Informe um e-mail válido"
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Select
            label="País"
            placeholder="País"
            value={pais}
            onChange={(event) => setPais(event.target.value)}
            options={DESTINOS.map((item) => ({
              value: item.nome,
              label: item.nome,
            }))}
          />
          <Select label="Cidade" placeholder="Cidade" options={cidades} />
        </div>
        <CurrencyInput
          label="Orçamento inicial"
          value={orcamento}
          onChange={setOrcamento}
          placeholder="0"
        />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-ink">Indicador de etapa</h2>
        <StepIndicator current={step} />
        <div className="flex gap-2">
          {([1, 2, 3] as const).map((value) => (
            <Button
              key={value}
              variant={step === value ? "primary" : "secondary"}
              onClick={() => setStep(value)}
            >
              Etapa {value}
            </Button>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-ink">Interesses</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {INTERESSES.map((option) => (
            <InterestCard
              key={option.id}
              option={option}
              selected={interesses.includes(option.id)}
              onToggle={toggleInteresse}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-xl text-ink">Perfil de viagem</h2>
        <div className="flex flex-col gap-3">
          {PERFIS_VIAGEM.map((option) => (
            <ProfileCard
              key={option.id}
              option={option}
              selected={perfil === option.id}
              onSelect={setPerfil}
            />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4 pb-8">
        <h2 className="text-xl text-ink">Login social</h2>
        <SocialAuth />
      </section>
    </div>
  );
}
