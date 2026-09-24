import Link from "next/link";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

/** "brand" is the new design (Home, for now): Care Teal and Charcoal on Warm White. */
type Tone = "light" | "dark" | "brand";

/**
 * Prose styling lives here, as a components map. There is no global .prose class
 * and no typography plugin — every element gets its Tailwind classes from this file.
 */
function map(tone: Tone): Components {
  const dark = tone === "dark";
  const brand = tone === "brand";

  const linkClass = dark
    ? "font-medium text-teal underline decoration-teal/40 underline-offset-4 hover:text-white"
    : brand
      ? "font-medium text-deep underline decoration-care underline-offset-4 hover:decoration-deep"
      : "font-medium text-teal-700 underline decoration-teal/40 underline-offset-4 hover:decoration-teal-700";

  return {
    p: ({ children }) => {
      // A paragraph that is entirely a quotation is one of the signed-off phrases —
      // same words, same place, given the weight it was signed off for.
      const only = Array.isArray(children) && children.length === 1 ? children[0] : children;
      if (typeof only === "string" && /^“.*”$|^".*"$/s.test(only.trim())) {
        return (
          <p
            className={`mt-6 border-l-4 px-6 py-5 leading-[1.7] first:mt-0 ${
              dark
                ? "rounded-r-card border-teal bg-teal-800 text-[1.08rem] text-white"
                : brand
                  ? "rounded-r-2xl border-care bg-white text-[1.1rem] text-charcoal"
                  : "rounded-r-card border-accent bg-mint-50 text-[1.08rem] text-ink"
            }`}
          >
            {children}
          </p>
        );
      }
      return <p className="mt-4 leading-[1.8] first:mt-0">{children}</p>;
    },

    strong: ({ children }) => (
      <strong className={`font-semibold ${dark ? "text-white" : brand ? "text-charcoal" : "text-ink"}`}>
        {children}
      </strong>
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

    ol: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-2.5 pl-5 first:mt-0">{children}</ol>
    ),

    li: ({ children }) => (
      <li
        className={`relative pl-7 leading-[1.7] before:absolute before:left-0 before:top-[0.65em] before:h-1.5 before:w-1.5 before:rounded-full ${
          dark ? "before:bg-teal" : brand ? "before:bg-care" : "before:bg-accent"
        }`}
      >
        {children}
      </li>
    ),

    blockquote: ({ children }) => (
      <blockquote
        className={`mt-6 rounded-r-card border-l-4 px-6 py-5 text-lg leading-[1.7] first:mt-0 ${
          dark
            ? "border-teal bg-teal-800 text-white"
            : brand
              ? "border-care bg-white text-charcoal"
              : "border-accent bg-mint-50 text-ink"
        }`}
      >
        {children}
      </blockquote>
    ),

    table: ({ children }) => (
      // A header row the copy left blank (the consultation fee block) is not drawn.
      <div className="mt-6 overflow-x-auto first:mt-0 [&_thead:has(th:empty)]:hidden">
        <table
          className={`w-full border-collapse overflow-hidden rounded-card text-left text-[0.95rem] ${
            dark ? "" : "border border-line"
          }`}
        >
          {children}
        </table>
      </div>
    ),

    thead: ({ children }) => (
      <thead className={dark ? "bg-teal-800" : "bg-mint-100"}>{children}</thead>
    ),

    tr: ({ children }) => (
      <tr className={`border-b last:border-0 ${dark ? "border-line-dark" : "border-line"}`}>
        {children}
      </tr>
    ),

    th: ({ children }) => (
      <th
        className={`px-4 py-3 font-display text-[0.78rem] font-semibold uppercase tracking-[0.08em] first:pl-5 last:pr-5 ${
          dark ? "text-teal" : "text-teal-800"
        }`}
      >
        {children}
      </th>
    ),

    td: ({ children }) => (
      <td className="px-4 py-3.5 align-top leading-[1.6] first:pl-5 last:pr-5">{children}</td>
    ),

    hr: () => <hr className={`mt-8 ${dark ? "border-line-dark" : "border-line"}`} />,

    h3: ({ children }) => (
      <h3
        className={`mt-8 font-display text-xl font-semibold first:mt-0 ${dark ? "text-white" : "text-ink"}`}
      >
        {children}
      </h3>
    ),
  };
}

const MAPS: Record<Tone, Components> = {
  light: map("light"),
  dark: map("dark"),
  brand: map("brand"),
};

export default function Markdown({
  children,
  tone = "light",
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
