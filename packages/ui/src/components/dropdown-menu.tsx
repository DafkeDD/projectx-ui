"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Portal } from "../lib/portal";
import { Slot, composeRefs } from "../lib/slot";
import { useAnchorPosition, type Align, type Side } from "../lib/anchor";
import { useControllableState, useEscapeKey, useOutsideClick } from "../lib/hooks";
import { Icon } from "../icons/icon";

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  anchorRef: React.RefObject<HTMLElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

const MenuContext = React.createContext<MenuContextValue | null>(null);

function useMenu(component: string): MenuContextValue {
  const context = React.useContext(MenuContext);
  if (!context) throw new Error(`<${component}> moet binnen <DropdownMenu> staan.`);
  return context;
}

const ITEM_SELECTOR = '[data-pxui-menuitem]:not([data-disabled])';

export interface DropdownMenuProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

/** DropdownMenu — actiemenu met volledige toetsenbordnavigatie. */
export function DropdownMenu({ open, defaultOpen = false, onOpenChange, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const anchorRef = React.useRef<HTMLElement | null>(null);
  const contentRef = React.useRef<HTMLDivElement | null>(null);

  return (
    <MenuContext.Provider value={{ open: isOpen, setOpen: setIsOpen, anchorRef, contentRef }}>
      {children}
    </MenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ asChild, onClick, onKeyDown, ...rest }, ref) {
    const { open, setOpen, anchorRef, contentRef } = useMenu("DropdownMenuTrigger");
    const Comp = (asChild ? Slot : "button") as React.ElementType;

    return (
      <Comp
        ref={composeRefs(ref as React.Ref<HTMLElement>, anchorRef)}
        type={asChild ? undefined : "button"}
        aria-haspopup="menu"
        aria-expanded={open}
        data-state={open ? "open" : "closed"}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          setOpen(!open);
        }}
        onKeyDown={(event: React.KeyboardEvent<HTMLButtonElement>) => {
          onKeyDown?.(event);
          if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setOpen(true);
            window.setTimeout(() => {
              const first = contentRef.current?.querySelector<HTMLElement>(ITEM_SELECTOR);
              first?.focus();
            }, 0);
          }
        }}
        {...rest}
      />
    );
  }
);

export interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side;
  align?: Align;
  offset?: number;
  matchWidth?: boolean;
  minWidth?: number;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    { side = "bottom", align = "start", offset = 6, matchWidth, minWidth = 200, className, children, style, ...rest },
    ref
  ) {
    const { open, setOpen, anchorRef, contentRef } = useMenu("DropdownMenuContent");
    const position = useAnchorPosition(anchorRef, contentRef, open, { side, align, offset, matchWidth });

    useEscapeKey(() => {
      setOpen(false);
      (anchorRef.current as HTMLElement | null)?.focus?.();
    }, open);
    useOutsideClick([anchorRef, contentRef], () => setOpen(false), open);

    React.useEffect(() => {
      if (!open) return;
      const first = contentRef.current?.querySelector<HTMLElement>(ITEM_SELECTOR);
      first?.focus({ preventScroll: true });
    }, [open, contentRef]);

    if (!open) return null;

    const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = Array.from(contentRef.current?.querySelectorAll<HTMLElement>(ITEM_SELECTOR) ?? []);
      if (items.length === 0) return;
      const index = items.indexOf(document.activeElement as HTMLElement);

      if (event.key === "ArrowDown") {
        event.preventDefault();
        items[(index + 1 + items.length) % items.length].focus();
      } else if (event.key === "ArrowUp") {
        event.preventDefault();
        items[(index - 1 + items.length) % items.length].focus();
      } else if (event.key === "Home") {
        event.preventDefault();
        items[0].focus();
      } else if (event.key === "End") {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (event.key === "Tab") {
        setOpen(false);
      }
    };

    return (
      <Portal>
        <div
          ref={composeRefs(ref, contentRef)}
          role="menu"
          data-side={position.side}
          className={cn("pxui-menu", className)}
          style={{ minWidth, ...position.style, ...style, opacity: position.ready ? 1 : 0 }}
          onKeyDown={onKeyDown}
          {...rest}
        >
          {children}
        </div>
      </Portal>
    );
  }
);

export interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode;
  /** Sneltoets rechts in het item. */
  shortcut?: React.ReactNode;
  /** Rode variant voor destructieve acties. */
  destructive?: boolean;
  /** Sluit het menu na selectie (standaard aan). */
  closeOnSelect?: boolean;
  asChild?: boolean;
}

export const DropdownMenuItem = React.forwardRef<HTMLButtonElement, DropdownMenuItemProps>(
  function DropdownMenuItem(
    { icon, shortcut, destructive, closeOnSelect = true, asChild, className, children, disabled, onClick, ...rest },
    ref
  ) {
    const { setOpen } = useMenu("DropdownMenuItem");
    const Comp = (asChild ? Slot : "button") as React.ElementType;

    return (
      <Comp
        ref={ref}
        type={asChild ? undefined : "button"}
        role="menuitem"
        tabIndex={-1}
        data-pxui-menuitem=""
        data-disabled={disabled ? "" : undefined}
        disabled={asChild ? undefined : disabled}
        className={cn("pxui-menu-item", destructive && "pxui-menu-item-destructive", className)}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (disabled) return;
          onClick?.(event);
          if (closeOnSelect) setOpen(false);
        }}
        {...rest}
      >
        {icon && <span className="pxui-menu-item-icon">{icon}</span>}
        <span className="pxui-menu-item-label">{children}</span>
        {shortcut && <span className="pxui-menu-item-shortcut">{shortcut}</span>}
      </Comp>
    );
  }
);

export interface DropdownMenuCheckboxItemProps extends Omit<DropdownMenuItemProps, "icon"> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
}

export const DropdownMenuCheckboxItem = React.forwardRef<HTMLButtonElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem({ checked, onCheckedChange, closeOnSelect = false, children, ...rest }, ref) {
    return (
      <DropdownMenuItem
        ref={ref}
        role="menuitemcheckbox"
        aria-checked={checked}
        closeOnSelect={closeOnSelect}
        icon={
          <span className={cn("pxui-menu-check", checked && "pxui-menu-check-on")}>
            {checked && <Icon name="check" size={13} strokeWidth={3} />}
          </span>
        }
        onClick={() => onCheckedChange?.(!checked)}
        {...rest}
      >
        {children}
      </DropdownMenuItem>
    );
  }
);

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DropdownMenuLabel({ className, ...rest }, ref) {
    return <div ref={ref} className={cn("pxui-menu-label", className)} {...rest} />;
  }
);

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DropdownMenuSeparator({ className, ...rest }, ref) {
    return <div ref={ref} role="separator" className={cn("pxui-menu-separator", className)} {...rest} />;
  }
);

export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  function DropdownMenuGroup({ className, ...rest }, ref) {
    return <div ref={ref} role="group" className={cn("pxui-menu-group", className)} {...rest} />;
  }
);
