import Image from "next/image";
import Link from "next/link";
import { drawings } from "../../../../data/drawings";

export default function DrawingDetail({ params }: { params: { slug: string } }) {
  const item = drawings.find((d) => d.slug === params.slug);

  if (!item) {
    return (
      <main className="min-h-screen px-6 py-10">
        <div className="hud p-5">
          <div style={{ fontFamily: "var(--font-mono)" }} className="text-sm">
            Not found
          </div>
          <Link
            href="/works"
            className="mt-4 inline-block hud px-4 py-2"
            style={{ fontFamily: "var(--font-ui)", color: "#d7dad9", letterSpacing: "2px" }}
          >
            &gt; BACK TO WORKS
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-6 py-10">
      <div className="hud p-5">
        <Link
          href="/works"
          className="inline-block hud px-4 py-2"
          style={{ fontFamily: "var(--font-ui)", color: "#d7dad9", letterSpacing: "2px" }}
        >
          &gt; BACK
        </Link>

        <h1 style={{ fontFamily: "var(--font-title)" }} className="mt-4 text-lg">
          {item.title}
        </h1>

        <div style={{ fontFamily: "var(--font-mono)" }} className="mt-2 text-sm opacity-80">
          {[item.year, item.medium].filter(Boolean).join(" · ")}
        </div>

        {item.note ? (
          <p style={{ fontFamily: "var(--font-mono)" }} className="mt-3 text-sm opacity-80">
            {item.note}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4">
        {item.images.map((src) => (
          <div key={src} className="hud p-3">
            <div className="relative w-full" style={{ aspectRatio: "16 / 9" }}>
              <Image src={src} alt={item.title} fill sizes="100vw" style={{ objectFit: "contain" }} />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
