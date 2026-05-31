import { VecLogoLarge } from "@/components/icons/VecLogoLarge";
import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-4"
      style={{ background: "linear-gradient(135deg, #056E6A 0%, #06928D 50%, #078F8A 100%)" }}
    >
      {/* Decorative circles */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute top-1/2 -right-16 h-56 w-56 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute -top-8 right-1/3 h-40 w-40 rounded-full bg-white/5" />

      <div className="relative z-10 w-full max-w-sm">

        {/* Logo */}
        <div className="mb-6 flex flex-col items-center">
          <VecLogoLarge className="text-white" />
        </div>

        {/* Verse */}
        <div className="mb-8 text-center">
          <p className="text-sm leading-relaxed text-white/80 italic">
            "Encomienda a Jehová tus obras,<br />y tus pensamientos serán afirmados."
          </p>
          <p className="mt-1.5 text-xs font-semibold tracking-widest text-white/50 uppercase">
            Proverbios 16:3
          </p>
        </div>

        {/* Page content */}
        {children}

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between text-xs text-white/40">
          <span>v{process.env.NEXT_PUBLIC_APP_VERSION}</span>
          <span>Iglesia Vida en Cristo &copy; {new Date().getFullYear()}</span>
          <span>Atmosfera</span>
        </div>
      </div>
    </div>
  );
}
