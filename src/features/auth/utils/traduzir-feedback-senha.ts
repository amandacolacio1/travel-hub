/**
 * O zxcvbn devolve as dicas em inglês. Traduz as mensagens mais frequentes;
 * o que não estiver no mapa é omitido, para não misturar os dois idiomas.
 */
const TRADUCOES: Record<string, string> = {
  "Straight rows of keys are easy to guess":
    "Sequências de teclas são fáceis de adivinhar",
  "Short keyboard patterns are easy to guess":
    "Padrões curtos de teclado são fáceis de adivinhar",
  'Repeats like "aaa" are easy to guess':
    'Repetições como "aaa" são fáceis de adivinhar',
  'Repeats like "abcabcabc" are only slightly harder to guess than "abc"':
    'Repetições como "abcabcabc" são quase tão fracas quanto "abc"',
  "Sequences like abc or 6543 are easy to guess":
    "Sequências como abc ou 6543 são fáceis de adivinhar",
  "Recent years are easy to guess": "Anos recentes são fáceis de adivinhar",
  "Dates are often easy to guess": "Datas são fáceis de adivinhar",
  "This is a top-10 common password": "Esta é uma das 10 senhas mais comuns",
  "This is a top-100 common password": "Esta é uma das 100 senhas mais comuns",
  "This is a very common password": "Esta senha é muito comum",
  "This is similar to a commonly used password":
    "Esta senha é parecida com uma muito usada",
  "A word by itself is easy to guess":
    "Uma única palavra é fácil de adivinhar",
  "Names and surnames by themselves are easy to guess":
    "Nomes e sobrenomes sozinhos são fáceis de adivinhar",
  "Common names and surnames are easy to guess":
    "Nomes e sobrenomes comuns são fáceis de adivinhar",
  "Use a few words, avoid common phrases":
    "Use algumas palavras, evitando frases comuns",
  "No need for symbols, digits, or uppercase letters":
    "Não é obrigatório usar símbolos, números ou maiúsculas",
  "Add another word or two. Uncommon words are better":
    "Acrescente mais uma ou duas palavras pouco comuns",
  "Capitalization doesn't help very much":
    "Usar maiúsculas ajuda pouco",
  "All-uppercase is almost as easy to guess as all-lowercase":
    "Tudo em maiúsculas é quase tão fraco quanto tudo em minúsculas",
  "Reversed words aren't much harder to guess":
    "Palavras invertidas não são muito mais difíceis de adivinhar",
  "Predictable substitutions like '@' instead of 'a' don't help very much":
    "Trocas previsíveis como '@' no lugar de 'a' ajudam pouco",
  "Avoid repeated words and characters":
    "Evite palavras e caracteres repetidos",
  "Avoid sequences": "Evite sequências",
  "Avoid recent years": "Evite anos recentes",
  "Avoid years that are associated with you":
    "Evite anos associados a você",
  "Avoid dates and years that are associated with you":
    "Evite datas e anos associados a você",
};

export function traduzirFeedbackDeSenha(mensagem: string): string | null {
  return TRADUCOES[mensagem] ?? null;
}
