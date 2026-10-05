"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import type { AuthPayload } from "../types/auth";
import { useRegistrationStore } from "../store/use-registration-store";
import { AccountStep } from "./account-step";
import { PreferencesStep } from "./preferences-step";
import { StepIndicator } from "./step-indicator";
import { TravelProfileStep } from "./travel-profile-step";

const TOTAL_ETAPAS = 3;

export function RegistrationWizard() {
  const router = useRouter();
  const wizardRef = useRef<HTMLDivElement>(null);
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

  useEffect(() => {
    wizardRef.current?.closest("[data-auth-scroll]")?.scrollTo({ top: 0 });
  }, [step]);

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
        destinos: preferences.destinos,
        dataPrevista: preferences.dataPrevista,
      },
      perfilViagem: data.perfil,
    };

    console.log(payload);
    reset();
    router.push("/dashboard");
  }

  return (
    <div ref={wizardRef} className="flex w-full flex-col items-start gap-[46px]">
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
