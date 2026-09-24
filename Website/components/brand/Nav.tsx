"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { BrandNavItem } from "@/lib/global";
import { ChevronDown, PhoneIcon } from "../Icons";
import Container from "../Container";
import { WhatsAppButton } from "./ui";

const normalise = (path: string) => (path !== "/" ? path.replace(/\/+$/, "") : "/");
const keyOf = (item: BrandNavItem) => item.href ?? item.title;

export default function Nav({
  items,
  clinic,
  whatsapp,
  tel,
  phoneDisplay,
  ctaLabels,
  defaultCtaLabel,
}: {
  items: BrandNavItem[];
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
  // Desktop dropdown opened by click or keyboard (hover opens it too, in CSS).
  const [menu, setMenu] = useState<string | null>(null);

  useEffect(() => {
    setOpen(false);
    setOpenGroup(null);
    setMenu(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const ctaLabel = ctaLabels[pathname] ?? defaultCtaLabel;
  const isCurrent = (href?: string) =>
    !!href && (pathname === href || (href !== "/" && pathname.startsWith(href + "/")));
  // A group without a page of its own is current when one of its pages is.
  const isCurrentItem = (item: BrandNavItem) =>
    isCurrent(item.href) || (!!item.children && item.children.some((child) => isCurrent(child.href)));

  const linkClass = (current: boolean) =>
    "flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-2 text-[0.9rem] font-medium transition-colors " +
    (current ? "bg-white text-charcoal" : "text-copy hover:text-charcoal");

  return (
    <header className="sticky top-0 z-40 bg-warm/90 backdrop-blur-md">
      {/* Its own gutter: below ~1,430px the row needs more than the page's 180px margins allow. */}
      <Container gutter="brandHeader">
        <div className="flex h-16 items-center justify-between gap-4 border-b border-charcoal/10 lg:h-20">
          <Link href="/" className="shrink-0 rounded-md" aria-label={clinic + " home"}>
            <Image
              src="/brand/logo.png"
              alt=""
              width={840}
              height={108}
              priority
              className="h-auto w-[12.5rem] sm:w-[14rem] xl:w-[12rem]"
            />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-0.5 xl:flex">
            {items.map((item) => {
              const key = keyOf(item);
              if (!item.children) {
                return (
                  <Link
                    key={key}
                    href={item.href ?? "/"}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={linkClass(isCurrent(item.href))}
                  >
                    {item.title}
                  </Link>
                );
              }
              const shown = menu === key;
              return (
                <div
                  key={key}
                  className="group relative"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setMenu(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") setMenu(null);
                  }}
                >
                  {item.href ? (
                    <Link
                      href={item.href}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={linkClass(isCurrentItem(item))}
                    >
                      {item.title}
                      <ChevronDown className="h-4 w-4" />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      aria-expanded={shown}
                      onClick={() => setMenu(shown ? null : key)}
                      className={linkClass(isCurrentItem(item))}
                    >
                      {item.title}
                      <ChevronDown className={`h-4 w-4 transition-transform ${shown ? "rotate-180" : ""}`} />
                    </button>
                  )}
                  <div
                    className={`absolute left-0 top-full w-72 pt-2 transition group-hover:visible group-hover:opacity-100 ${
                      shown ? "visible opacity-100" : "invisible opacity-0"
                    } ${item.href ? "group-focus-within:visible group-focus-within:opacity-100" : ""}`}
                  >
                    <ul className="overflow-hidden rounded-2xl bg-white p-2 shadow-[0_24px_50px_-20px_rgb(35_31_32/0.3)]">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={isCurrent(child.href) ? "page" : undefined}
                            className={
                              "block rounded-xl px-4 py-2.5 text-[0.92rem] transition-colors hover:bg-care-50 hover:text-charcoal " +
                              (isCurrent(child.href) ? "bg-care-50 text-charcoal" : "text-copy")
                            }
                          >
                            {child.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            {/* Not beside the full nav (xl): the row would not fit, and the hero, footer and
                phone bar all carry the number. */}
            <a
              href={tel}
              aria-label={"Call " + phoneDisplay}
              className="group hidden h-11 w-11 items-center justify-center rounded-lg border border-charcoal/12 bg-white text-charcoal transition-colors hover:border-deep hover:text-deep sm:flex xl:hidden"
            >
              <PhoneIcon className="h-5 w-5 transition-transform motion-safe:group-hover:rotate-12" />
            </a>
            <span className="hidden lg:block">
              <WhatsAppButton href={whatsapp} label={ctaLabel} compact />
            </span>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="flex h-11 w-11 items-center justify-center rounded-lg border border-charcoal/12 bg-white text-charcoal xl:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <span aria-hidden="true" className="relative block h-4 w-5">
                <span
                  className={
                    "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all " +
                    (open ? "top-1.5 rotate-45" : "top-0")
                  }
                />
                <span
                  className={
                    "absolute left-0 top-1.5 block h-0.5 w-5 rounded-full bg-current transition-opacity " +
                    (open ? "opacity-0" : "opacity-100")
                  }
                />
                <span
                  className={
                    "absolute left-0 block h-0.5 w-5 rounded-full bg-current transition-all " +
                    (open ? "top-1.5 -rotate-45" : "top-3")
                  }
                />
              </span>
            </button>
          </div>
        </div>
      </Container>

      {open ? (
        <div id="mobile-menu" className="max-h-[calc(100dvh-4rem)] overflow-y-auto bg-warm xl:hidden">
          <Container className="py-4">
            <ul className="divide-y divide-charcoal/10">
              {items.map((item) => {
                const key = keyOf(item);
                const expanded = openGroup === key;
                const toggle = () => setOpenGroup((v) => (v === key ? null : key));
                return (
                  <li key={key} className="py-1">
                    <div className="flex items-center">
                      {item.href ? (
                        <Link
                          href={item.href}
                          aria-current={isCurrent(item.href) ? "page" : undefined}
                          className={
                            "flex-1 py-3 text-[1.1rem] font-medium " +
                            (isCurrent(item.href) ? "text-deep" : "text-charcoal")
                          }
                        >
                          {item.title}
                        </Link>
                      ) : (
                        // A group with no page of its own: the whole row opens it.
                        <button
                          type="button"
                          onClick={toggle}
                          aria-expanded={expanded}
                          className={
                            "flex flex-1 items-center justify-between py-3 text-left text-[1.1rem] font-medium " +
                            (isCurrentItem(item) ? "text-deep" : "text-charcoal")
                          }
                        >
                          {item.title}
                          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-charcoal">
                            <ChevronDown className={"h-5 w-5 transition-transform " + (expanded ? "rotate-180" : "")} />
                          </span>
                        </button>
                      )}
                      {item.children && item.href ? (
                        <button
                          type="button"
                          onClick={toggle}
                          aria-expanded={expanded}
                          className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-charcoal"
                        >
                          <span className="sr-only">{expanded ? "Hide treatments" : "Show treatments"}</span>
                          <ChevronDown className={"h-5 w-5 transition-transform " + (expanded ? "rotate-180" : "")} />
                        </button>
                      ) : null}
                    </div>
                    {item.children && expanded ? (
                      <ul className="mb-2 space-y-1 border-l-2 border-care pl-4">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              aria-current={isCurrent(child.href) ? "page" : undefined}
                              className={
                                "block py-2.5 text-[0.98rem] " + (isCurrent(child.href) ? "text-deep" : "text-copy")
                              }
                            >
                              {child.title}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <span className="mt-5 flex lg:hidden">
              <WhatsAppButton href={whatsapp} label={ctaLabel} className="w-full" />
            </span>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
