import { AuthShell } from "@/components/shared/auth-shell";
import { LoginForm } from "@/components/shared/login-form";
import { loginAdminAction } from "@/lib/actions/auth";

export default function AdminLoginPage() {
  return (
    <AuthShell title="Espace agence" subtitle="Connectez-vous à votre tableau de bord.">
      <LoginForm action={loginAdminAction} submitLabel="Se connecter" forgotHref="/admin/login/forgot" />
    </AuthShell>
  );
}
