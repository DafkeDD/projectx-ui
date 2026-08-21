"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Portal } from "../lib/portal";
import { Icon, type IconName } from "../icons/icon";

export type ToastTone = "neutral" | "accent" | "green" | "amber" | "red" | "blue";

export interface ToastOptions {
  title: React.ReactNode;
  description?: React.ReactNode;
  tone?: ToastTone;
  /** Duur in ms; 0 blijft staan tot de gebruiker sluit. */
  duration?: number;
  icon?: React.ReactNode;
  action?: { label: string; onClick: () => void };
}

export interface ToastItem extends ToastOptions {
  id: string;
}

interface ToastContextValue {
  toasts: ToastItem[];
  push: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = React.createContext<ToastContextValue | null>(null);

export interface ToastProviderProps {
  children: React.ReactNode;
  /** Maximum aantal zichtbare meldingen. */
  max?: number;
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left" | "bottom-center" | "top-center";
  /** Standaardduur in ms. */
  duration?: number;
}

/** ToastProvider — zet dit één keer rond je app. */
export function ToastProvider({
  children,
  max = 4,
  position = "bottom-right",
  duration = 4200,
}: ToastProviderProps) {
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);
  const timers = React.useRef(new Map<string, number>());

  const dismiss = React.useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timer = timers.current.get(id);
    if (timer) window.clearTimeout(timer);
    timers.current.delete(id);
  }, []);

  const push = React.useCallback(
    (options: ToastOptions) => {
      const id = `pxui-toast-${Math.random().toString(36).slice(2, 10)}`;
      setToasts((prev) => [...prev, { ...options, id }].slice(-max));
      const life = options.duration ?? duration;
      if (life > 0) {
        timers.current.set(id, window.setTimeout(() => dismiss(id), life));
      }
      return id;
    },
    [max, duration, dismiss]
  );

  React.useEffect(() => {
    const map = timers.current;
    return () => map.forEach((timer) => window.clearTimeout(timer));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, push, dismiss }}>
      {children}
      <Toaster position={position} />
    </ToastContext.Provider>
  );
}

const TONE_ICON: Record<ToastTone, IconName> = {
  neutral: "info",
  accent: "sparkles",
  green: "checkCircle",
  amber: "alert",
  red: "alertCircle",
  blue: "info",
};

/** Toaster — rendert de stapel meldingen. Wordt door ToastProvider geplaatst. */
export function Toaster({ position = "bottom-right" }: { position?: ToastProviderProps["position"] }) {
  const context = React.useContext(ToastContext);
  if (!context || context.toasts.length === 0) return null;

  return (
    <Portal>
      <div className={cn("pxui-toaster", `pxui-toaster-${position}`)} role="region" aria-label="Meldingen">
        {context.toasts.map((toast) => {
          const tone = toast.tone ?? "neutral";
          return (
            <div key={toast.id} className={cn("pxui-toast", `pxui-toast-${tone}`)} role="status">
              <span className="pxui-toast-icon">
                {toast.icon ?? <Icon name={TONE_ICON[tone]} size={15} />}
              </span>
              <div className="pxui-toast-body">
                <div className="pxui-toast-title">{toast.title}</div>
                {toast.description && <div className="pxui-toast-description">{toast.description}</div>}
              </div>
              {toast.action && (
                <button
                  type="button"
                  className="pxui-toast-action"
                  onClick={() => {
                    toast.action?.onClick();
                    context.dismiss(toast.id);
                  }}
                >
                  {toast.action.label}
                </button>
              )}
              <button
                type="button"
                className="pxui-toast-close"
                aria-label="Sluiten"
                onClick={() => context.dismiss(toast.id)}
              >
                <Icon name="x" size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </Portal>
  );
}

export interface ToastApi {
  (options: ToastOptions): string;
  success: (title: React.ReactNode, options?: Omit<ToastOptions, "title" | "tone">) => string;
  error: (title: React.ReactNode, options?: Omit<ToastOptions, "title" | "tone">) => string;
  warning: (title: React.ReactNode, options?: Omit<ToastOptions, "title" | "tone">) => string;
  info: (title: React.ReactNode, options?: Omit<ToastOptions, "title" | "tone">) => string;
  dismiss: (id: string) => void;
}

/** useToast — meldingen tonen vanuit elk component onder de ToastProvider. */
export function useToast(): ToastApi {
  const context = React.useContext(ToastContext);
  if (!context) throw new Error("useToast() vereist een <ToastProvider> hoger in de boom.");

  return React.useMemo(() => {
    const api = ((options: ToastOptions) => context.push(options)) as ToastApi;
    api.success = (title, options) => context.push({ ...options, title, tone: "green" });
    api.error = (title, options) => context.push({ ...options, title, tone: "red" });
    api.warning = (title, options) => context.push({ ...options, title, tone: "amber" });
    api.info = (title, options) => context.push({ ...options, title, tone: "blue" });
    api.dismiss = context.dismiss;
    return api;
  }, [context]);
}
