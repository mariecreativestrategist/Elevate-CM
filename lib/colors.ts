export const ACCENT_COLORS = ["magenta", "corail", "sauge", "butter"] as const;
export type AccentColor = (typeof ACCENT_COLORS)[number];

const ACCENT_CLASSES: Record<AccentColor, { bg: string; text: string; border: string; tintBg: string }> = {
  magenta: { bg: "bg-magenta", text: "text-magenta", border: "border-magenta", tintBg: "bg-magenta-tint" },
  corail: { bg: "bg-corail", text: "text-corail", border: "border-corail", tintBg: "bg-corail-tint" },
  sauge: { bg: "bg-sauge", text: "text-sauge", border: "border-sauge", tintBg: "bg-sauge-tint" },
  butter: { bg: "bg-butter", text: "text-butter", border: "border-butter", tintBg: "bg-butter-tint" },
};

/** Couleur stable dérivée de l'id (même client = même couleur partout dans l'app). */
export function accentForId(id: string): AccentColor {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}

export function accentClasses(color: AccentColor) {
  return ACCENT_CLASSES[color];
}

export const CONTENT_TYPE_LABELS: Record<string, string> = {
  reel: "Reel",
  carrousel: "Carrousel",
  story: "Story",
  post: "Post",
  tiktok: "TikTok",
};

export const CONTENT_TYPE_COLORS: Record<string, AccentColor> = {
  reel: "magenta",
  carrousel: "corail",
  story: "butter",
  post: "sauge",
  tiktok: "magenta",
};

export const POST_STATUS_LABELS: Record<string, string> = {
  planifie: "Planifié",
  a_valider: "À valider",
  approuve: "Approuvé",
  publie: "Publié",
};

export const REQUEST_STATUS_LABELS: Record<string, string> = {
  nouveau: "Nouveau",
  en_cours: "En cours",
  traite: "Traité",
};

export const INVOICE_STATUS_LABELS: Record<string, string> = {
  payee: "Payée",
  en_attente: "En attente",
  en_retard: "En retard",
};

export const STAGE_LABELS: Record<string, string> = {
  onboarding: "Onboarding",
  strategie: "Stratégie",
  calendrier: "Calendrier éditorial",
  resultats: "Résultats",
};

export const KANBAN_COLUMN_LABELS: Record<string, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  en_validation: "En validation",
  termine: "Terminé",
};
