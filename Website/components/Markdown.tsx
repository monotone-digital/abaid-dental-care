import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/** "brand": Charcoal and Deep Teal on Warm White, white or Care Teal. "deep": white on Deep Teal. */
type Tone = "brand" | "deep";

/**
 * Prose styling lives here, as a components map. There is no global .prose class
 * and no typography plugin — every element gets its Tailwind classes from this file.
 */
function map(tone: Tone): Components {
  const deep = tone === "deep";

  const linkClass = deep
    ? "font-medium text-white underline decoration-care underline-offset-4 hover:decoration-white"
    : "font-medium text-deep underline decoration-care underline-offset-4 hover:decoration-deep";

  return {
    p: ({ children }) => {
      // A paragraph that is entirely a quotation is one of the signed-off phrases —
      // same words, same place, given the weight it was signed off for.
      const only = Array.isArray(children) && children.length === 1 ? children[0] : children;
      if (typeof only === "string" && /^“.*”$|^".*"$/s.test(only.trim())) {
        return (
          <p
            className={`mt-6 rounded-r-2xl border-l-4 border-care px-6 py-5 text-[1.1rem] leading-[1.7] first:mt-0 ${
              deep ? "bg-white/8 text-white" : "bg-white text-charcoal"
            }`}
          >
            {children}
          </p>
        );
      }
      return <p className="mt-4 leading-[1.8] first:mt-0">{children}</p>;
    },

    strong: ({ children }) => (
      <strong className={`font-semibold ${deep ? "text-white" : "text-charcoal"}`}>{children}</strong>
    ),

    em: ({ children }) => <em className="italic">{children}</em>,

    a: ({ href, children }) => {
      const target = href ?? "#";
      return target.startsWith("/") || target.startsWith("#") ? (
        <Link href={target} className={linkClass}>
          {children}
        </Link>
      ) : (
        <a href={target} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {children}
        </a>
      );
    },

    ul: ({ children }) => <ul className="mt-4 space-y-2.5 first:mt-0">{children}</ul>,

    ol: ({ children }) => <ol className="mt-4 list-decimal space-y-2.5 pl-5 first:mt-0">{children}</ol>,

    li: ({ children }) => (
      <li className="relative pl-7 leading-[1.7] before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-care">
        {children}
      </li>
    ),

    blockquote: ({ children }) => (
      <blockquote
        className={`mt-6 rounded-r-2xl border-l-4 border-care px-6 py-5 text-lg leading-[1.7] first:mt-0 ${
          deep ? "bg-white/8 text-white" : "bg-white text-charcoal"
        }`}
      >
        {children}
      </blockquote>
    ),

    table: ({ children }) => (
      // A header row the copy left blank (the consultation fee block) is not drawn.
      <div className="mt-6 overflow-x-auto first:mt-0 [&_thead:has(th:empty)]:hidden">
        <table
          className={`w-full border-collapse overflow-hidden rounded-2xl text-left text-[0.98rem] ${
            deep ? "bg-white/6" : "bg-white"
          }`}
        >
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => <thead className={deep ? "bg-white/8" : "bg-care-100"}>{children}</thead>,

    tr: ({ children }) => (
      <tr className={`border-b last:border-0 ${deep ? "border-white/12" : "border-charcoal/8"}`}>{children}</tr>
    ),

    th: ({ children }) => (
      <th
        className={`px-4 py-3 text-[0.8rem] font-semibold uppercase tracking-[0.1em] first:pl-5 last:pr-5 ${
          deep ? "text-care-100" : "text-deep"
        }`}
      >
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className={`px-4 py-3.5 align-top leading-[1.6] first:pl-5 last:pr-5 ${deep ? "text-white" : "text-charcoal"}`}>
        {children}
      </td>
    ),

    hr: () => <hr className={`mt-8 ${deep ? "border-white/12" : "border-charcoal/10"}`} />,

    h3: ({ children }) => (
      <h3 className={`mt-8 text-xl font-medium first:mt-0 ${deep ? "text-white" : "text-charcoal"}`}>{children}</h3>
    ),
  };
}

const MAPS: Record<Tone, Components> = {
  brand: map("brand"),
  deep: map("deep"),
};

export default function Markdown({
  children,
  tone = "brand",
  className = "",
}: {
  children: string;
  tone?: Tone;
  className?: string;
}) {
  if (!children.trim()) return null;

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={MAPS[tone]}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
