import type { ReactNode } from 'react';

const AUTH_BG =
  'https://images.unsplash.com/photo-1644079446600-219068676743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

/** Full-bleed photo backdrop with a cinematic vignette. */
export default function AuthBackground({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Image, slightly scaled & tilted like a poster wall */}
      <div
        className="absolute inset-[-6%] bg-cover bg-center"
        style={{ backgroundImage: `url("${AUTH_BG}")`, transform: 'rotate(-4deg) scale(1.08)' }}
      />
      {/* Vignette overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="relative z-10">{children}</div>
    </div>
  );
}
