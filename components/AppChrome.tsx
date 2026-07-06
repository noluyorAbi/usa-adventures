"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Map, ListChecks, Route, Clock, Plus, Mountain } from "lucide-react";
import { useApp } from "@/lib/store";
import AddPlaceSheet from "./AddPlaceSheet";
import Celebration from "./Celebration";

const NAV = [
  { href: "/map", label: "Karte", Icon: Map },
  { href: "/plans", label: "Pläne", Icon: ListChecks },
  { href: "/trips", label: "Trips", Icon: Route },
  { href: "/memories", label: "Erinnerungen", Icon: Clock },
] as const;

export default function AppChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { openSheet } = useApp();

  // Landing page renders bare (its own header). Chrome only inside the app.
  const isLanding = pathname === "/";
  if (isLanding) {
    return (
      <>
        {children}
        <AddPlaceSheet />
        <Celebration />
      </>
    );
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-6xl flex-col px-4 pt-4 pb-28 sm:px-6 sm:pt-6 sm:pb-10">
      {/* Desktop / top header */}
      <header className="mb-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="grid h-9 w-9 place-items-center rounded-xl text-white"
            style={{ background: "var(--sky-grad)" }}
          >
            <Mountain size={18} strokeWidth={2.2} />
          </span>
          <span className="font-display text-lg leading-none">
            USA<span className="text-[var(--text-dim)]">/</span>Adventures
          </span>
        </Link>

        <nav className="hidden items-center gap-1 rounded-full border border-[var(--border)] bg-white/60 p-1 backdrop-blur sm:flex">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition"
                style={{ color: active ? "#fff" : "var(--text-muted)" }}
              >
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: "var(--sky-grad)" }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Icon size={15} /> {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <button
          onClick={() => openSheet()}
          className="hidden items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white sm:flex"
          style={{ background: "var(--sun-grad)" }}
        >
          <Plus size={16} /> Spot
        </button>
      </header>

      <main className="flex-1">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="fixed inset-x-0 bottom-0 z-[900] border-t border-[var(--border)] bg-white/85 backdrop-blur-lg sm:hidden">
        <div className="mx-auto flex max-w-6xl items-center justify-around px-2 py-2">
          {NAV.map(({ href, label, Icon }) => {
            const active = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className="flex flex-1 flex-col items-center gap-0.5 py-1 text-[11px]"
                style={{ color: active ? "var(--sky)" : "var(--text-dim)" }}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Mobile FAB */}
      <motion.button
        onClick={() => openSheet()}
        whileTap={{ scale: 0.92 }}
        className="fixed right-5 bottom-20 z-[950] flex h-14 w-14 items-center justify-center rounded-full text-white shadow-[0_16px_40px_-8px_rgba(242,104,63,0.55)] sm:hidden"
        style={{ background: "var(--sun-grad)" }}
        aria-label="Ort hinzufügen"
      >
        <Plus size={26} />
      </motion.button>

      <AddPlaceSheet />
      <Celebration />
    </div>
  );
}
