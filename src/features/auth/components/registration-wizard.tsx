"use client";

import type { AuthPayload } from "../types/auth";
import { useRegistrationStore } from "../store/use-registration-store";
import { AccountStep } from "./account-step";
import { PreferencesStep } from "./preferences-step";
import { StepIndicator } from "./step-indicator";
import { TravelProfileStep } from "./travel-profile-step";

const TOTAL_ETAPAS = 3;

export function RegistrationWizard() {
  const {
    step,
    maxStepReached,
    account,
    preferences,
    travelProfile,
    setStep,
    setAccount,
    setPreferences,
    setTravelProfile,
    reset,
  } = useRegistrationStore();

  function handleStepClick(target: number) {
    if (target < 1 || target > maxStepReached) {
      return;
    }

    setStep(target as typeof step);
  }

  function handleAccountAdvance(data: typeof account) {
    setAccount(data);
    setStep(2);
  }

  function handlePreferencesAdvance(data: typeof preferences) {
    setPreferences(data);
    setStep(3);
  }

  function handlePreferencesBack(data: typeof preferences) {
    setPreferences(data);
    setStep(1);
  }

  function handleTravelProfileBack(data: { perfil: typeof travelProfile }) {
    setTravelProfile(data.perfil);
    setStep(2);
  }

  function handleFinishRegistration(data: { perfil: typeof travelProfile }) {
    setTravelProfile(data.perfil);

    const payload: AuthPayload = {
      conta: account,
      preferencias: {
        interesses: preferences.interesses,
        orcamentoInicial: preferences.orcamentoInicial,
        orcamentoFinal: preferences.orcamentoFinal,
        destinos: [{ pais: preferences.pais, cidade: preferences.cidade }],
        dataPrevista: "",
      },
      perfilViagem: data.perfil,
    };

    // TODO: substituir por useMutation(registerUser) quando a API existir
    console.log(payload);
    reset();
  }

  return (
    <div className="flex w-full flex-col items-start gap-[46px]">
      <StepIndicator
        current={step}
        total={TOTAL_ETAPAS}
        onStepClick={handleStepClick}
      />

      {step === 1 && (
        <AccountStep defaultValues={account} onAdvance={handleAccountAdvance} />
      )}
      {step === 2 && (
        <PreferencesStep
          defaultValues={preferences}
          onAdvance={handlePreferencesAdvance}
          onBack={handlePreferencesBack}
        />
      )}
      {step === 3 && (
        <TravelProfileStep
          defaultValues={{ perfil: travelProfile }}
          onFinish={handleFinishRegistration}
          onBack={handleTravelProfileBack}
        />
      )}
    </div>
  );
}
