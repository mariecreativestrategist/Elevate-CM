import { requireAdmin } from "@/lib/auth";
import { AccountProfileForm } from "@/components/admin/account-profile-form";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export default async function AdminParametresPage() {
  const session = await requireAdmin();

  return (
    <div className="max-w-xl space-y-6 p-8">
      <div>
        <h1 className="font-serif text-3xl text-ink">Paramètres</h1>
        <p className="text-sm text-muted-foreground">Gère ton profil et ton mot de passe administrateur.</p>
      </div>

      <AccountProfileForm nom={session.nom} email={session.email} />
      <ChangePasswordForm />
    </div>
  );
}
