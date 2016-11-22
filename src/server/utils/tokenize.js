const TOKENIZE_OPTIONS = {
  maxLength: 100,
  useLowercase: true,
  joinCharacter: '-',
};

export function tokenize(value, options = TOKENIZE_OPTIONS) {
  const tokenizeRegex = /((?!([a-zA-Z0-9\-])).)/gi;

  const token = value.trim()
    .replace(/\s/gi, options.joinCharacter)
    .replace(tokenizeRegex, '');

  return options.useLowercase ? token.toLowerCase() : token;
}
