const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateName(nome: string): string | undefined {
  const valor = nome.trim();

  if (!valor || valor.length < 3) {
    return "Informe seu nome completo";
  }

  return undefined;
}

export function validateEmail(email: string): string | undefined {
  const valor = email.trim();

  if (!valor) {
    return "Informe seu e-mail";
  }

  if (!EMAIL_REGEX.test(valor)) {
    return "Informe um e-mail válido";
  }

  return undefined;
}

export function validatePassword(senha: string): string | undefined {
  if (senha.length < 8) {
    return "Mínimo 8 caracteres";
  }

  return undefined;
}

export function isAccountStepValid(nome: string, email: string, senha: string) {
  return !validateName(nome) && !validateEmail(email) && !validatePassword(senha);
}
