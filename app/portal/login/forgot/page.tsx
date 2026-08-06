import { AuthShell } from "@/components/shared/auth-shell";
import { ForgotPasswordForm } from "@/components/shared/forgot-password-form";
import { requestClientPasswordResetAction } from "@/lib/actions/auth";
import { SITE_NAME } from "@/lib/config";

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      eyebrow={SITE_NAME}
      title="Mot de passe oublié"
      subtitle="Recevez un lien de réinitialisation par e-mail."
    >
      <ForgotPasswordForm action={requestClientPasswordResetAction} />
    </AuthShell>
  );
}
