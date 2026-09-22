"use client";

import { useState } from "react";
import type { AuthStep, PerfilViagem } from "../types/auth";
import { isAccountStepValid } from "../utils/validation";
import { AccountStep } from "./account-step";
import { PreferencesStep } from "./preferences-step";
import { StepIndicator } from "./step-indicator";
import { TravelProfileStep } from "./travel-profile-step";

const TOTAL_ETAPAS = 3;

export function RegistrationWizard() {
  const [etapa, setEtapa] = useState<AuthStep>(1);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [interesses, setInteresses] = useState<string[]>(["natureza"]);
  const [pais, setPais] = useState("Brasil");
  const [cidade, setCidade] = useState("");
  const [orcamentoInicial, setOrcamentoInicial] = useState(5000);
  const [orcamentoFinal, setOrcamentoFinal] = useState(12000);
  const [perfil, setPerfil] = useState<PerfilViagem>("sozinho");

  function toggleInterest(id: string) {
    setInteresses((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  function handleCountryChange(value: string) {
    setPais(value);
    setCidade("");
  }

  const canLeaveAccountStep = isAccountStepValid(nome, email, senha);

  function goToNextStep() {
    if (etapa >= TOTAL_ETAPAS || !canLeaveAccountStep) {
      return;
    }

    setEtapa((etapa + 1) as AuthStep);
  }

  function handleStepClick(step: number) {
    if (!canLeaveAccountStep || step < 1 || step > TOTAL_ETAPAS) {
      return;
    }

    setEtapa(step as AuthStep);
  }

  function goToPreviousStep() {
    if (etapa > 1) {
      setEtapa((etapa - 1) as AuthStep);
    }
  }

  return (
    <div className="flex w-full flex-col items-start gap-[46px]">
      <StepIndicator
        current={etapa}
        total={TOTAL_ETAPAS}
        disabled={!canLeaveAccountStep}
        onStepClick={handleStepClick}
      />

      {etapa === 1 && (
        <AccountStep
          nome={nome}
          email={email}
          senha={senha}
          onNameChange={setNome}
          onEmailChange={setEmail}
          onPasswordChange={setSenha}
          onAdvance={goToNextStep}
        />
      )}
      {etapa === 2 && (
        <PreferencesStep
          interesses={interesses}
          onToggleInterest={toggleInterest}
          pais={pais}
          onCountryChange={handleCountryChange}
          cidade={cidade}
          onCityChange={setCidade}
          orcamentoInicial={orcamentoInicial}
          onInitialBudgetChange={setOrcamentoInicial}
          orcamentoFinal={orcamentoFinal}
          onFinalBudgetChange={setOrcamentoFinal}
          onAdvance={goToNextStep}
          onBack={goToPreviousStep}
        />
      )}
      {etapa === 3 && (
        <TravelProfileStep
          perfil={perfil}
          onSelectProfile={setPerfil}
          onFinish={goToNextStep}
          onBack={goToPreviousStep}
        />
      )}
    </div>
  );
}
