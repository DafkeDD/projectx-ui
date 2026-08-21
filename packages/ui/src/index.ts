/**
 * ProjectX UI — publieke API.
 * Alles is zelf geschreven: geen shadcn, geen Radix, geen externe UI-dependencies.
 */

/* ---------- Hulpmiddelen ---------- */
export { cn, type ClassValue } from "./lib/cn";
export { variants, type VariantConfig, type VariantsFn } from "./lib/variants";
export { Slot, composeRefs } from "./lib/slot";
export { Portal } from "./lib/portal";
export { useAnchorPosition, type Side, type Align, type AnchorOptions } from "./lib/anchor";
export * from "./lib/date";
export * from "./lib/schedule";
export * from "./lib/use-voice";
export * from "./lib/image";
export {
  useControllableState,
  useOutsideClick,
  useEscapeKey,
  useLockScroll,
  useFocusTrap,
  useRovingIndex,
  useCopyToClipboard,
  useMounted,
  useIsoLayoutEffect,
} from "./lib/hooks";

/* ---------- Iconen ---------- */
export { Icon, ICONS, ICON_NAMES, type IconName, type IconProps } from "./icons/icon";

/* ---------- Componenten ---------- */
export * from "./components/accordion";
export * from "./components/alert";
export * from "./components/app-shell";
export * from "./components/auth-layout";
export * from "./components/avatar";
export * from "./components/avatar-upload";
export * from "./components/badge";
export * from "./components/breadcrumb";
export * from "./components/button";
export * from "./components/calendar";
export * from "./components/card";
export * from "./components/chart";
export * from "./components/checkbox";
export * from "./components/chip";
export * from "./components/combobox";
export * from "./components/command";
export * from "./components/composer";
export * from "./components/confetti";
export * from "./components/copy-button";
export * from "./components/data-pill";
export * from "./components/date-picker";
export * from "./components/dialog";
export * from "./components/drawer";
export * from "./components/dropdown-menu";
export * from "./components/empty-state";
export * from "./components/entity-header";
export * from "./components/field";
export * from "./components/file-drop";
export * from "./components/input";
export * from "./components/kbd";
export * from "./components/label";
export * from "./components/list-row";
export * from "./components/modal-manager";
export * from "./components/otp-input";
export * from "./components/pagination";
export * from "./components/period-nav";
export * from "./components/popover";
export * from "./components/progress";
export * from "./components/pulse-dot";
export * from "./components/radio-group";
export * from "./components/resource-columns";
export * from "./components/section-header";
export * from "./components/segmented";
export * from "./components/select";
export * from "./components/separator";
export * from "./components/sidebar";
export * from "./components/skeleton";
export * from "./components/slider";
export * from "./components/spinner";
export * from "./components/stat";
export * from "./components/stepper";
export * from "./components/swatch-picker";
export * from "./components/swimlanes";
export * from "./components/switch";
export * from "./components/table";
export * from "./components/tabs";
export * from "./components/task-item";
export * from "./components/textarea";
export * from "./components/theme";
export * from "./components/time-field";
export * from "./components/time-slot-list";
export * from "./components/toast";
export * from "./components/toolbar";
export * from "./components/tooltip";
export * from "./components/voice-button";
export * from "./components/week-schedule";
export * from "./components/workspace";
