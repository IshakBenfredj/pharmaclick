"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Download, X, Smartphone, Zap, CheckCircle2 } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already in standalone mode
    if (typeof window !== "undefined") {
      const isStandalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as unknown as { standalone?: boolean }).standalone ===
          true;

      if (isStandalone) {
        setIsInstalled(true);
        return;
      }

      // Check if user dismissed recently (e.g. within 7 days)
      const dismissedUntil = localStorage.getItem(
        "pwa_install_dismissed_until",
      );
      if (dismissedUntil && Date.now() < parseInt(dismissedUntil, 10)) {
        return;
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        setIsVisible(true);
      };

      const handleAppInstalled = () => {
        setIsInstalled(true);
        setIsVisible(false);
        setDeferredPrompt(null);
      };

      window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.addEventListener("appinstalled", handleAppInstalled);

      return () => {
        window.removeEventListener(
          "beforeinstallprompt",
          handleBeforeInstallPrompt,
        );
        window.removeEventListener("appinstalled", handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;

      if (choiceResult.outcome === "accepted") {
        setIsVisible(false);
        setDeferredPrompt(null);
      }
    } catch (err) {
      console.error("[PWA] Installation prompt error:", err);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Dismiss for 7 days
    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(
      "pwa_install_dismissed_until",
      sevenDaysLater.toString(),
    );
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl sm:rounded-3xl shadow-2xl shadow-sky-950/20 border border-sky-100 p-4 sm:p-5 relative overflow-hidden">
        {/* Glow accent */}
        <div className="absolute -top-12 -left-12 w-28 h-28 bg-primary/10 rounded-full blur-xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 left-3 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="إغلاق التنبيه"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-start gap-3.5 pl-6">
          {/* Logo icon */}
          <div className="relative w-12 h-12 rounded-2xl bg-linear-to-tr from-primary to-sky-600 p-0.5 shrink-0 shadow-md shadow-primary/20 flex items-center justify-center overflow-hidden">
            <Image
              src="/logo.png"
              alt="PharmaClick App Icon"
              width={48}
              height={48}
              className="w-full h-full object-cover rounded-xl"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                تثبيت تطبيق PharmaClick
              </h3>
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                <Zap className="w-2.5 h-2.5 text-emerald-600" />
                سريع وخفيف
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              وصول فوري لكافة مستحضرات العناية وتتبع طلبياتك بسهولة دون الحاجة
              لمتجر التطبيقات.
            </p>

            <div className="flex items-center gap-2 mt-2 text-[11px] text-slate-600">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                يعمل بدون إنترنت
              </span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1">
                <Smartphone className="w-3 h-3 text-primary" />
                تثبيت بنقرة واحدة
              </span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100">
          <button
            onClick={handleInstallClick}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 active:scale-95 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>تثبيت الآن</span>
          </button>
          <button
            onClick={handleDismiss}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs sm:text-sm font-medium transition-colors"
          >
            لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
}
