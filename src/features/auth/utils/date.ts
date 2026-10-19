export function getTodayISO(): string {
  const hoje = new Date();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");

  return `${hoje.getFullYear()}-${mes}-${dia}`;
}

export function validateFutureDate(data: string): string | undefined {
  if (!data) {
    return undefined;
  }

  if (data < getTodayISO()) {
    return "Escolha uma data a partir de hoje";
  }

  return undefined;
}
