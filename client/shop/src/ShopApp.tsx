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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(46,109,164,0.28),_transparent_55%)]" />
      <section className="relative w-full max-w-xl rounded-3xl border border-white/10 bg-white/[0.06] px-6 py-12 text-center shadow-2xl backdrop-blur-sm sm:px-12 sm:py-16">
        <img
          src="/logo.png"
          alt="EquiProfile"
          className="mx-auto h-16 w-auto object-contain"
        />
        <p className="mt-5 text-sm font-semibold uppercase tracking-[0.2em] text-[#75b9e6]">
          EquiProfile Shop
        </p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
          Coming soon
        </h1>
        <p className="mx-auto mt-5 max-w-md text-base leading-7 text-white/65">
          We are preparing a carefully selected equestrian shop. There are no
          products or payments available here yet.
        </p>
        <a
          href="https://equiprofile.online"
          className="mt-8 inline-flex min-h-11 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#07182d] transition hover:bg-[#e8f3fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#07182d]"
        >
          Return to EquiProfile
        </a>
      </section>
    </main>
  );
}
