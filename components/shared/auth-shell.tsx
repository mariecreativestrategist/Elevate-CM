import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "@/components/shared/logo";

export function AuthShell({
  title,
  subtitle,
  children,
  topRight,
  large = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  topRight?: { label: string; href: string };
  large?: boolean;
}) {
  return (
    <main className="relative flex flex-1 items-center justify-center bg-paper px-6 py-16">
      {topRight && (
        <Link
          href={topRight.href}
          className="absolute right-6 top-6 rounded-full border border-ink/15 px-4 py-1.5 text-xs text-ink transition-colors hover:bg-ink hover:text-paper"
        >
          {topRight.label}
        </Link>
      )}
      <div className="w-full max-w-sm space-y-8">
        <div className="space-y-3 text-center">
          <Logo
            className="font-mono text-xs tracking-[0.3em] text-magenta uppercase"
            imgClassName="mx-auto h-9 w-auto"
          />
          <h1 className={large ? "font-serif text-5xl text-ink" : "font-serif text-3xl text-ink"}>{title}</h1>
          {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">{children}</div>
      </div>
    </main>
  );
}
