import { AuthShell } from "@/components/shared/auth-shell";
import { LoginForm } from "@/components/shared/login-form";
import { loginClientAction } from "@/lib/actions/auth";
import { SITE_NAME } from "@/lib/config";

export default function PortalLoginPage() {
  return (
    <AuthShell
      eyebrow={SITE_NAME}
      title="Espace client"
      subtitle="Connectez-vous à votre espace de collaboration."
      topRight={{ label: "Espace admin", href: "/admin/login" }}
      large
    >
      <LoginForm action={loginClientAction} submitLabel="Se connecter" forgotHref="/portal/login/forgot" />
    </AuthShell>
  );
}
