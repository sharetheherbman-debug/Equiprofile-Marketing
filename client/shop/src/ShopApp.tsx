import { useEffect } from "react";

export default function ShopApp() {
  useEffect(() => {
    document.title = "EquiProfile Shop | Coming soon";
    let robots = document.head.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex,nofollow";
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07182d] px-5 py-16 text-white">
      <div className="absolute inset-0 bg-[url('/images/hero/image6.jpg')] bg-cover bg-center" role="img" aria-label="Horse moving through a sunlit field" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#07182d]/95 via-[#07182d]/80 to-[#102a43]/65" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(197,165,90,0.20),_transparent_52%)]" />
      <section className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-[#07182d]/70 px-6 py-12 text-center shadow-2xl backdrop-blur-md sm:px-12 sm:py-16">
        <img
          src="/logo.png"
          alt="EquiProfile Shop"
          className="mx-auto h-16 w-auto object-contain"
        />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#75b9e6]">
          EquiProfile Shop
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/65">
          A curated equestrian shopping experience is being prepared with the
          same care and clarity you expect from EquiProfile.
        </p>
        <a
          href="https://equiprofile.online"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#07182d] transition hover:bg-[#e8f3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07182d]"
        >
          Return to EquiProfile
        </a>
        <p className="mt-8 text-xs text-white/45">
          EquiProfile Shop · Part of{" "}
          <a href="https://amarktai.co.za" className="underline underline-offset-2 hover:text-white/70">AmarktAI Network</a>
        </p>
      </section>
    </main>
  );
}
