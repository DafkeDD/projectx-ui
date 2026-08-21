"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { useControllableState } from "../lib/hooks";
import { Icon } from "../icons/icon";

interface AccordionContextValue {
  open: string[];
  toggle: (value: string) => void;
  variant: "bordered" | "separated" | "plain";
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null);
const ItemContext = React.createContext<string | null>(null);

function useAccordion(component: string): AccordionContextValue {
  const context = React.useContext(AccordionContext);
  if (!context) throw new Error(`<${component}> moet binnen <Accordion> staan.`);
  return context;
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "defaultValue" | "onChange"> {
  /** "single" sluit andere items bij het openen van een item. */
  type?: "single" | "multiple";
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
  /** "single" met collapsible=false houdt er altijd één open. */
  collapsible?: boolean;
  variant?: "bordered" | "separated" | "plain";
}

/** Accordion — in- en uitklapbare secties. */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  {
    type = "single",
    value,
    defaultValue = [],
    onValueChange,
    collapsible = true,
    variant = "bordered",
    className,
    children,
    ...rest
  },
  ref
) {
  const [open, setOpen] = useControllableState<string[]>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const toggle = (item: string) => {
    const isOpen = open.includes(item);
    if (type === "single") {
      if (isOpen && !collapsible) return;
      setOpen(isOpen ? [] : [item]);
    } else {
      setOpen(isOpen ? open.filter((entry) => entry !== item) : [...open, item]);
    }
  };

  return (
    <AccordionContext.Provider value={{ open, toggle, variant }}>
      <div ref={ref} className={cn("pxui-accordion", `pxui-accordion-${variant}`, className)} {...rest}>
        {children}
      </div>
    </AccordionContext.Provider>
  );
});

export interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled, className, children, ...rest },
  ref
) {
  const { open } = useAccordion("AccordionItem");
  const isOpen = open.includes(value);

  return (
    <ItemContext.Provider value={value}>
      <div
        ref={ref}
        data-state={isOpen ? "open" : "closed"}
        data-disabled={disabled ? "" : undefined}
        className={cn("pxui-accordion-item", className)}
        {...rest}
      >
        {children}
      </div>
    </ItemContext.Provider>
  );
});

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ icon, className, children, ...rest }, ref) {
    const { open, toggle } = useAccordion("AccordionTrigger");
    const value = React.useContext(ItemContext);
    const isOpen = value ? open.includes(value) : false;

    return (
      <button
        ref={ref}
        type="button"
        aria-expanded={isOpen}
        data-state={isOpen ? "open" : "closed"}
        className={cn("pxui-accordion-trigger", className)}
        onClick={() => value && toggle(value)}
        {...rest}
      >
        {icon && <span className="pxui-accordion-icon">{icon}</span>}
        <span className="pxui-accordion-label">{children}</span>
        <Icon name="chevronDown" size={17} className="pxui-accordion-caret" />
      </button>
    );
  }
);

export const AccordionContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function AccordionContent({ className, children, ...rest }, ref) {
    const { open } = useAccordion("AccordionContent");
    const value = React.useContext(ItemContext);
    const isOpen = value ? open.includes(value) : false;

    return (
      <div
        ref={ref}
        hidden={!isOpen || undefined}
        data-state={isOpen ? "open" : "closed"}
        className={cn("pxui-accordion-content", className)}
        {...rest}
      >
        <div className="pxui-accordion-content-inner">{children}</div>
      </div>
    );
  }
);
