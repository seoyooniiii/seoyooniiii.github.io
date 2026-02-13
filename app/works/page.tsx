import Link from "next/link";
import Image from "next/image";
import { drawings } from "../../data/drawings";

export default function Works() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="hud p-5">
        <h1 style={{ fontFamily: "var(--font-title)" }} className="text-lg">
          WORKS
        </h1>
        <p style={{ fontFamily: "var(--font-mono)" }} className="mt-3 text-sm opacity-80">
          3D / TouchDesigner / Drawing
        </p>
      </div>

      <section className="mt-6">
        <div className="hud p-4">
          <div
            style={{
              fontFamily: "var(--font-ui)",
              color: "#d7dad9",
              letterSpacing: "2px",
            }}
            className="text-sm opacity-90"
          >
            &gt; DRAWING
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {drawings.map((d) => (
            <Link
              key={d.slug}
              href={`/works/drawing/${d.slug}`}
              className="hud block overflow-hidden hover:opacity-90 active:opacity-80"
            >
              <div className="relative aspect-[4/3]">
                <Image
                  src={d.cover}
                  alt={d.title}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div className="p-3">
                <div style={{ fontFamily: "var(--font-mono)" }} className="text-sm">
                  {d.title}
                </div>
                <div style={{ fontFamily: "var(--font-mono)" }} className="mt-1 text-xs opacity-70">
                  {[d.year, d.medium].filter(Boolean).join(" · ")}
                </div>
                {d.tags?.length ? (
                  <div style={{ fontFamily: "var(--font-mono)" }} className="mt-2 text-xs opacity-70">
                    [{d.tags.join(", ")}]
                  </div>
                ) : null}
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
