import { AuthContainer, RegistrationWizard } from "@/features/auth";

export default function RegistrationPage() {
  return (
    <AuthContainer>
      <RegistrationWizard />
    </AuthContainer>
  );
}
