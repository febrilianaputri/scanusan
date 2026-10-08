import { useRef, useState, type ReactNode } from 'react';

// Default backdrop — replace this URL to change the default image for Sign In.
export const DEFAULT_AUTH_BG =
  'https://images.unsplash.com/photo-1644079446600-219068676743?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920';

const STORAGE_KEY = 'kami-auth-bg';

/** Full-bleed photo backdrop with a cinematic vignette and a user-replaceable image. */
export default function AuthBackground({ children }: { children: ReactNode }) {
  const [bg, setBg] = useState<string>(() => localStorage.getItem(STORAGE_KEY) || DEFAULT_AUTH_BG);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const url = String(reader.result);
      setBg(url);
      try { localStorage.setItem(STORAGE_KEY, url); } catch { /* image too large to persist */ }
    };
    reader.readAsDataURL(file);
  };

  const reset = () => { setBg(DEFAULT_AUTH_BG); localStorage.removeItem(STORAGE_KEY); };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Image, slightly scaled & tilted like a poster wall */}
      <div
        className="absolute inset-[-6%] bg-cover bg-center"
        style={{ backgroundImage: `url("${bg}")`, transform: 'rotate(-4deg) scale(1.08)' }}
      />
      {/* Vignette overlays */}
      <div className="absolute inset-0 bg-black/55" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-black/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

      <div className="relative z-10">{children}</div>

      {/* Background changer */}
      <div className="absolute bottom-4 right-4 z-20 flex gap-2">
        <input ref={inputRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => { handleFile(e.target.files?.[0]); e.target.value = ''; }} />
        {bg !== DEFAULT_AUTH_BG && (
          <button onClick={reset}
            className="px-3 py-2 rounded-lg text-xs font-semibold font-body text-white/80 bg-black/50 border border-white/20 backdrop-blur hover:bg-black/70">
            Reset
          </button>
        )}
        <button onClick={() => inputRef.current?.click()}
          className="px-3 py-2 rounded-lg text-xs font-semibold font-body text-white bg-black/50 border border-white/20 backdrop-blur hover:bg-black/70">
          🖼 Ganti Latar
        </button>
      </div>
    </div>
  );
}
