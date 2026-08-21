"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Portal } from "../lib/portal";
import { useAnchorPosition } from "../lib/anchor";
import { useControllableState, useEscapeKey, useOutsideClick } from "../lib/hooks";
import { Icon } from "../icons/icon";

export interface ComboboxOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  /** Optionele groepsnaam; opties met dezelfde groep staan samen. */
  group?: string;
}

export interface ComboboxProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange" | "defaultValue"> {
  options: ComboboxOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  invalid?: boolean;
  size?: "sm" | "md" | "lg";
  /** Toont een wisknop wanneer er een waarde gekozen is. */
  clearable?: boolean;
}

/** Combobox — zoekbare keuzelijst met toetsenbordnavigatie. */
export const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(function Combobox(
  {
    options,
    value,
    defaultValue,
    onValueChange,
    placeholder = "Kies…",
    searchPlaceholder = "Zoeken…",
    emptyMessage = "Geen resultaten",
    disabled,
    invalid,
    size = "md",
    clearable,
    className,
    ...rest
  },
  ref
) {
  const [current, setCurrent] = useControllableState<string | undefined>({
    value,
    defaultValue,
    onChange: (next) => next !== undefined && onValueChange?.(next),
  });
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);

  const triggerRef = React.useRef<HTMLButtonElement | null>(null);
  const anchorRef = triggerRef as React.RefObject<HTMLElement | null>;
  const contentRef = React.useRef<HTMLDivElement | null>(null);
  const listRef = React.useRef<HTMLDivElement | null>(null);

  const position = useAnchorPosition(anchorRef, contentRef, open, {
    side: "bottom",
    align: "start",
    offset: 5,
    matchWidth: true,
  });

  useEscapeKey(() => {
    setOpen(false);
    triggerRef.current?.focus();
  }, open);
  useOutsideClick([anchorRef, contentRef], () => setOpen(false), open);

  const filtered = React.useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter((option) =>
      `${option.label} ${option.description ?? ""} ${option.value}`.toLowerCase().includes(needle)
    );
  }, [options, query]);

  const selected = options.find((option) => option.value === current);

  React.useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  React.useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelectorAll<HTMLElement>("[data-pxui-combobox-item]")[activeIndex];
    node?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open]);

  const choose = (option: ComboboxOption) => {
    if (option.disabled) return;
    setCurrent(option.value);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const option = filtered[activeIndex];
      if (option) choose(option);
    }
  };

  const groups = React.useMemo(() => {
    const map = new Map<string, ComboboxOption[]>();
    for (const option of filtered) {
      const key = option.group ?? "";
      const list = map.get(key) ?? [];
      list.push(option);
      map.set(key, list);
    }
    return map;
  }, [filtered]);

  let flatIndex = -1;

  return (
    <div ref={ref} className={cn("pxui-combobox", className)} {...rest}>
      <button
        ref={triggerRef}
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        aria-invalid={invalid || undefined}
        data-state={open ? "open" : "closed"}
        className={cn("pxui-select-trigger", `pxui-input-${size}`, invalid && "pxui-input-invalid")}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        {selected?.icon && <span className="pxui-select-item-icon">{selected.icon}</span>}
        <span className={cn("pxui-select-value", !selected && "pxui-select-placeholder")}>
          {selected?.label ?? placeholder}
        </span>
        {clearable && selected && !disabled && (
          <span
            role="button"
            tabIndex={-1}
            aria-label="Wissen"
            className="pxui-combobox-clear"
            onClick={(event) => {
              event.stopPropagation();
              setCurrent("");
            }}
          >
            <Icon name="x" size={14} />
          </span>
        )}
        <Icon name="chevronsUpDown" size={15} className="pxui-select-caret" />
      </button>

      {open && (
        <Portal>
          <div
            ref={contentRef}
            className="pxui-select-content"
            style={{ ...position.style, opacity: position.ready ? 1 : 0 }}
            onKeyDown={onKeyDown}
          >
            <div className="pxui-select-search">
              <Icon name="search" size={15} />
              <input
                autoFocus
                className="pxui-select-search-input"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>
            <div className="pxui-select-list" ref={listRef} role="listbox">
              {filtered.length === 0 && <div className="pxui-select-empty">{emptyMessage}</div>}
              {Array.from(groups.entries()).map(([group, items]) => (
                <div key={group || "_"} role="group">
                  {group && <div className="pxui-menu-label">{group}</div>}
                  {items.map((option) => {
                    flatIndex += 1;
                    const index = flatIndex;
                    const isSelected = option.value === current;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        role="option"
                        tabIndex={-1}
                        aria-selected={isSelected}
                        data-pxui-combobox-item=""
                        data-active={index === activeIndex ? "" : undefined}
                        data-disabled={option.disabled ? "" : undefined}
                        className={cn("pxui-select-item", isSelected && "pxui-select-item-selected")}
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => choose(option)}
                      >
                        {option.icon && <span className="pxui-select-item-icon">{option.icon}</span>}
                        <span className="pxui-select-item-text">
                          <span className="pxui-select-item-label">{option.label}</span>
                          {option.description && (
                            <span className="pxui-select-item-description">{option.description}</span>
                          )}
                        </span>
                        {isSelected && <Icon name="check" size={15} className="pxui-select-item-check" />}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
});
