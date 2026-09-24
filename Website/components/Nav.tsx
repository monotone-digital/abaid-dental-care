"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, PhoneIcon, ToothLogo } from "./Icons";
import { WhatsAppButton, ctaMotion, iconMotion } from "./Buttons";
import Container from "./Container";

type Item = { title: string; href: string; children?: { title: string; href: string }[] };

const normalise = (path: string) => (path !== "/" ? path.replace(/\/+$/, "") : "/");

export default function Nav({
  items,
  clinic,
  whatsapp,
  tel,
  phoneDisplay,
  ctaLabels,
  defaultCtaLabel,
}: {
  items: Item[];
  clinic: string;
  whatsapp: string;
  tel: string;
  phoneDisplay: string;
  ctaLabels: Record<string, string>;
  defaultCtaLabel: string;
}) {
  const pathname = normalise(usePathname() ?? "/");
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const ctaLabel = ctaLabels[pathname] ?? defaultCtaLabel;
  const isCurrent = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(href + "/"));

  return (
    <div className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      {/* The header gutter, and slightly tighter spacing from xl, so the full row fits (see Container). */}
      <Container gutter="header">
        <div className="flex h-18 items-center justify-between gap-4 lg:h-20 xl:gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" aria-label={clinic + " home"}>
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-mint text-teal-800">
              <ToothLogo className="h-6 w-6" />
            </span>
            <span className="font-display text-lg font-bold leading-none tracking-tight text-ink sm:text-xl xl:text-lg">
              Abaid <span className="text-teal-700">Dental Care</span>
            </span>
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {items.map((item) =>
              item.children ? (
                <div key={item.href} className="group relative">
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={
                      "flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.86rem] font-medium transition-colors " +
                      (isCurrent(item.href) ? "bg-mint text-teal-900" : "text-body hover:text-teal-800")
                    }
                  >
                    {item.title}
                    <ChevronDown className="h-4 w-4" />
                  </Link>
                  <div className="invisible absolute left-0 top-full w-72 pt-2 opacity-0 transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <ul className="overflow-hidden rounded-card border border-line bg-white py-2 shadow-xl shadow-ink/5">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={isCurrent(child.href) ? "page" : undefined}
                            className={
                              "block px-5 py-2.5 text-[0.92rem] transition-colors hover:bg-mint-50 hover:text-teal-800 " +
                              (isCurrent(child.href) ? "text-teal-800" : "text-body")
                            }
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={
                    "whitespace-nowrap rounded-full px-2.5 py-2 text-[0.86rem] font-medium transition-colors " +
                    (isCurrent(item.href) ? "bg-mint text-teal-900" : "text-body hover:text-teal-800")
                  }
                >
                  {item.title}
                </Link>
              ),
            )}
          </nav>

          <div className="flex items-center gap-3 xl:gap-2">
            <a
              href={tel}
              aria-label={"Call " + phoneDisplay}
              className={`group hidden h-11 w-11 items-center justify-center rounded-full bg-mint text-teal-800 hover:bg-teal-600 hover:text-white hover:shadow-teal-700/25 sm:flex ${ctaMotion}`}
            >
              <PhoneIcon className={`h-5 w-5 ${iconMotion} motion-safe:group-hover:rotate-12 motion-safe:group-hover:scale-115`} />
            </a>
            <span className="hidden lg:block">
              <WhatsAppButton
                href={whatsapp}
                label={ctaLabel}
                className="whitespace-nowrap xl:px-4"
              />
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-ink xl:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span
                  className={
                    "absolute left-0 block h-0.5 w-5 bg-current transition-all " +
                    (open ? "top-1.5 rotate-45" : "top-0")
                  }
                />
                <span
                  className={
                    "absolute left-0 top-1.5 block h-0.5 w-5 bg-current transition-opacity " +
                    (open ? "opacity-0" : "opacity-100")
                  }
                />
                <span
                  className={
                    "absolute left-0 block h-0.5 w-5 bg-current transition-all " +
                    (open ? "top-1.5 -rotate-45" : "top-3")
                  }
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div
          id="mobile-menu"
          className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t border-line bg-white xl:hidden"
        >
          <Container className="py-4">
            <ul className="divide-y divide-line">
              {items.map((item) => (
                <li key={item.href} className="py-1">
                  <div className="flex items-center">
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={
                        "flex-1 py-3 font-display text-[1.05rem] font-medium " +
                        (isCurrent(item.href) ? "text-teal-800" : "text-ink")
                      }
                    >
                      {item.title}
                    </Link>
                    {item.children ? (
                      <button
                        type="button"
                        onClick={() => setOpenGroup((v) => (v === item.href ? null : item.href))}
                        aria-expanded={openGroup === item.href}
                        className="flex h-10 w-10 items-center justify-center rounded-full text-teal-800"
                      >
                        <span className="sr-only">
                          {openGroup === item.href ? "Hide treatments" : "Show treatments"}
                        </span>
                        <ChevronDown
                          className={
                            "h-5 w-5 transition-transform " + (openGroup === item.href ? "rotate-180" : "")
                          }
                        />
                      </button>
                    ) : null}
                  </div>
                  {item.children && openGroup === item.href ? (
                    <ul className="mb-2 space-y-1 border-l-2 border-mint pl-4">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={isCurrent(child.href) ? "page" : undefined}
                            className={
                              "block py-2.5 text-[0.95rem] " +
                              (isCurrent(child.href) ? "text-teal-800" : "text-body")
                            }
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              ))}
            </ul>
            <span className="mt-5 block lg:hidden">
              <WhatsAppButton href={whatsapp} label={ctaLabel} className="w-full" />
            </span>
          </Container>
        </div>
      ) : null}
    </div>
  );
}
