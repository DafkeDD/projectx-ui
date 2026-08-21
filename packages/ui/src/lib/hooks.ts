"use client";
import * as React from "react";

/** useLayoutEffect dat niet klaagt tijdens server-rendering. */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/** Stabiele client-check (voorkomt hydration-mismatch bij portals). */
export function useMounted(): boolean {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Werkt zowel controlled (`value` + `onChange`) als uncontrolled
 * (`defaultValue`). Elke interactieve component in ProjectX UI gebruikt dit.
 */
export function useControllableState<T>(options: {
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}): [T, (next: T | ((prev: T) => T)) => void] {
  const { value, defaultValue, onChange } = options;
  const isControlled = value !== undefined;
  const [internal, setInternal] = React.useState<T>(defaultValue);
  const current = isControlled ? (value as T) : internal;

  const onChangeRef = React.useRef(onChange);
  useIsoLayoutEffect(() => {
    onChangeRef.current = onChange;
  });

  const setValue = React.useCallback(
    (next: T | ((prev: T) => T)) => {
      const resolved =
        typeof next === "function" ? (next as (prev: T) => T)(currentRef.current) : next;
      if (!isControlled) setInternal(resolved);
      onChangeRef.current?.(resolved);
    },
    [isControlled]
  );

  const currentRef = React.useRef(current);
  currentRef.current = current;

  return [current, setValue];
}

/** Roept `handler` aan bij een klik buiten alle meegegeven refs. */
export function useOutsideClick(
  refs: Array<React.RefObject<HTMLElement | null>>,
  handler: (event: MouseEvent | TouchEvent) => void,
  enabled = true
): void {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  React.useEffect(() => {
    if (!enabled) return;
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target || !document.contains(target)) return;
      for (const ref of refs) {
        if (ref.current && ref.current.contains(target)) return;
      }
      handlerRef.current(event);
    };
    document.addEventListener("mousedown", listener, true);
    document.addEventListener("touchstart", listener, true);
    return () => {
      document.removeEventListener("mousedown", listener, true);
      document.removeEventListener("touchstart", listener, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, ...refs]);
}

/** Escape-toets afhandelen (capture, zodat geneste lagen eerst sluiten). */
export function useEscapeKey(handler: () => void, enabled = true): void {
  const handlerRef = React.useRef(handler);
  handlerRef.current = handler;

  React.useEffect(() => {
    if (!enabled) return;
    const listener = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.stopPropagation();
        handlerRef.current();
      }
    };
    document.addEventListener("keydown", listener, true);
    return () => document.removeEventListener("keydown", listener, true);
  }, [enabled]);
}

/** Blokkeert scrollen van de pagina zolang een overlay open staat. */
export function useLockScroll(enabled: boolean): void {
  React.useEffect(() => {
    if (!enabled) return;
    const { overflow, paddingRight } = document.body.style;
    const gap = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
    return () => {
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
    };
  }, [enabled]);
}

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled]):not([type='hidden'])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/** Houdt focus binnen een container (dialog, drawer) en herstelt hem daarna. */
export function useFocusTrap(
  ref: React.RefObject<HTMLElement | null>,
  enabled: boolean
): void {
  React.useEffect(() => {
    if (!enabled || !ref.current) return;
    const node = ref.current;
    const previous = document.activeElement as HTMLElement | null;

    const focusables = () => Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
    const first = focusables()[0];
    (first ?? node).focus({ preventScroll: true });

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusables();
      if (items.length === 0) {
        event.preventDefault();
        return;
      }
      const firstItem = items[0];
      const lastItem = items[items.length - 1];
      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (!event.shiftKey && document.activeElement === lastItem) {
        event.preventDefault();
        firstItem.focus();
      }
    };

    node.addEventListener("keydown", onKeyDown);
    return () => {
      node.removeEventListener("keydown", onKeyDown);
      previous?.focus?.({ preventScroll: true });
    };
  }, [enabled, ref]);
}

/** Pijltjes-navigatie voor menu's, listboxen en tabs. */
export function useRovingIndex(count: number, initial = -1) {
  const [index, setIndex] = React.useState(initial);

  const move = React.useCallback(
    (delta: number) => {
      setIndex((prev) => {
        if (count === 0) return -1;
        const next = prev + delta;
        if (next < 0) return count - 1;
        if (next >= count) return 0;
        return next;
      });
    },
    [count]
  );

  return { index, setIndex, move };
}

/** Kopieert tekst naar het klembord en houdt kort een "gekopieerd"-status bij. */
export function useCopyToClipboard(timeout = 1600) {
  const [copied, setCopied] = React.useState(false);

  const copy = React.useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), timeout);
        return true;
      } catch {
        return false;
      }
    },
    [timeout]
  );

  return { copied, copy };
}
