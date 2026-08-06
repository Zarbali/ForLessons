"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useApp } from "@/context/AppProvider";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/learn", label: "Learn" },
  { href: "/games", label: "Games" },
  { href: "/ai", label: "AI" },
  { href: "/focus", label: "Focus" },
  { href: "/progress", label: "Progress" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useApp();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const isHome = pathname === "/";

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overHero = isHome && !scrolled && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        overHero
          ? "border-b border-transparent bg-transparent"
          : "border-b border-[var(--border)] bg-[color-mix(in_oklab,var(--background)_82%,transparent)] backdrop-blur-xl",
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
        <Link
          href="/"
          className="group flex items-center gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-2xl text-sm font-bold shadow-[var(--shadow-glow)] transition",
              overHero
                ? "bg-spring text-[#052e16]"
                : "bg-[var(--brand)] text-[var(--brand-foreground)]",
            )}
          >
            V
          </span>
          <span
            className={cn(
              "font-display max-w-[40vw] truncate text-lg font-semibold tracking-tight transition sm:max-w-none sm:text-xl",
              overHero ? "text-white" : "text-[var(--foreground)]",
            )}
          >
            Veronika
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-xl px-3.5 py-2 text-sm font-medium transition-colors",
                  overHero
                    ? active
                      ? "bg-white/15 text-white"
                      : "text-white/65 hover:bg-white/10 hover:text-white"
                    : active
                      ? "bg-[color-mix(in_oklab,var(--brand)_14%,transparent)] text-[var(--brand)]"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            onClick={toggleTheme}
            className={cn(
              "h-10 w-10",
              overHero && "text-white hover:bg-white/10 hover:text-white",
            )}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "h-10 w-10 md:hidden",
              overHero && "text-white hover:bg-white/10 hover:text-white",
            )}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-[var(--border)] bg-[var(--background)] md:hidden"
          >
            <nav className="flex flex-col gap-1 px-4 py-3 pb-5">
              {NAV_LINKS.map((link, i) => {
                const active =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-3.5 text-base font-medium",
                        active
                          ? "bg-[color-mix(in_oklab,var(--brand)_14%,transparent)] text-[var(--brand)]"
                          : "text-[var(--muted-foreground)] hover:bg-[var(--surface-hover)]",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
