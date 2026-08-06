import { SITE_NAME, LOGO_IMAGE_PATH } from "@/lib/config";
import { cn } from "@/lib/utils";

/**
 * Affiche le logo image si `LOGO_IMAGE_PATH` est renseigné dans lib/config.ts,
 * sinon le nom du site en texte. `className` contrôle la taille et la couleur du texte
 * (ignoré en mode image, où c'est la taille naturelle de l'image qui prime — utiliser
 * `imgClassName` pour l'ajuster dans ce cas).
 */
export function Logo({ className, imgClassName }: { className?: string; imgClassName?: string }) {
  if (LOGO_IMAGE_PATH) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={LOGO_IMAGE_PATH} alt={SITE_NAME} className={cn("h-8 w-auto", imgClassName)} />;
  }
  return <span className={className}>{SITE_NAME}</span>;
}
