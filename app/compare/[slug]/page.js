import { notFound } from "next/navigation";
import { compareData } from "@/lib/compareData";

export async function generateMetadata({ params }) {
  const data = compareData[params.slug];
  if (!data) return {};

  return {
    title: data.title,
    description: data.description,
    alternates: { canonical: data.canonical },
  };
}

export default function ComparePage({ params }) {
  const data = compareData[params.slug];
  if (!data) return notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-4">{data.h1}</h1>
      <p className="text-gray-600 mb-8">{data.description}</p>

      {/* Comparison Table */}
      <div className="border rounded-xl overflow-hidden mb-10">
        <div className="grid grid-cols-3 bg-gray-100 font-semibold p-4">
          <div>Feature</div>
          <div>PDF Linx</div>
          <div>{data.competitor}</div>
        </div>

        {data.table.map((row, i) => (
          <div key={i} className="grid grid-cols-3 border-t p-4">
            <div>{row[0]}</div>
            <div>{row[1]}</div>
            <div>{row[2]}</div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <a
        href={data.ctaHref}
        className="inline-block mb-10 px-6 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
      >
        {data.ctaText}
      </a>

      {/* SEO Content */}
      <div className="space-y-4 text-gray-700">
        {data.content.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </main>
  );
}
