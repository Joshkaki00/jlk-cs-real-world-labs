// Warm "notebook" palette — a cream paper background with hand-drawn-style
// ink borders and flat drop shadows, instead of a dark developer-tool theme.
export const COLORS = {
  ink: '#17324d',
  muted: '#5f7184',
  paper: '#f7f4e9',
  white: '#fffefa',
  cyan: '#1fb7c5',
  cyanDark: '#087d8b',
  indigo: '#5557c9',
  amber: '#f6b93b',
  coral: '#ef6a67',
  mint: '#55c993',
  line: '#cad5dc',
} as const;

export const FONT_FAMILY = 'Nunito, system-ui, sans-serif';
export const MONO_FONT_FAMILY = '"Roboto Mono", monospace';

export function titleFont(size: number): string {
  return `900 ${size}px ${FONT_FAMILY}`;
}

export function bodyFont(size: number): string {
  return `700 ${size}px ${FONT_FAMILY}`;
}

export function monoFont(size: number): string {
  return `700 ${size}px ${MONO_FONT_FAMILY}`;
}
