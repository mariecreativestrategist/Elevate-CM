import { AuthShell } from "@/components/shared/auth-shell";
import { ResetPasswordForm } from "@/components/shared/reset-password-form";
import { SITE_NAME } from "@/lib/config";

export default async function AdminResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <AuthShell eyebrow={SITE_NAME} title="Lien invalide">
        <p className="text-sm text-muted-foreground">
          Ce lien de réinitialisation est incomplet. Merci de refaire une demande.
        </p>
      </AuthShell>
    );
  }

  return (
    <AuthShell eyebrow={SITE_NAME} title="Nouveau mot de passe">
      <ResetPasswordForm token={token} />
    </AuthShell>
  );
}
