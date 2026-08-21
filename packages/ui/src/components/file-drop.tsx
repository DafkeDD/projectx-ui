"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Icon } from "../icons/icon";

export interface FileDropProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "onDrop" | "title"> {
  /** Toegestane types, bv. ".pdf,.png" of "image/*". */
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  /** Wordt aangeroepen met de gekozen of gesleepte bestanden. */
  onFiles?: (files: File[]) => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: React.ReactNode;
}

/** FileDrop — sleepzone met bestandskiezer. */
export const FileDrop = React.forwardRef<HTMLDivElement, FileDropProps>(function FileDrop(
  {
    accept,
    multiple,
    disabled,
    onFiles,
    title = "Sleep bestanden hierheen",
    description = "of klik om te bladeren",
    icon,
    className,
    children,
    ...rest
  },
  ref
) {
  const [dragging, setDragging] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handle = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    onFiles?.(Array.from(files));
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled || undefined}
      className={cn("pxui-filedrop", dragging && "pxui-filedrop-dragging", disabled && "pxui-filedrop-disabled", className)}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (disabled) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(event) => {
        event.preventDefault();
        if (!disabled) setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(event) => {
        event.preventDefault();
        setDragging(false);
        if (!disabled) handle(event.dataTransfer.files);
      }}
      {...rest}
    >
      <input
        ref={inputRef}
        type="file"
        className="pxui-sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={(event) => handle(event.target.files)}
      />
      <span className="pxui-filedrop-icon">{icon ?? <Icon name="upload" size={24} />}</span>
      <span className="pxui-filedrop-title">{title}</span>
      {description && <span className="pxui-filedrop-description">{description}</span>}
      {children}
    </div>
  );
});

export interface FileItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  size?: number;
  /** Uploadvoortgang 0–100; laat weg als het bestand klaar is. */
  progress?: number;
  onRemove?: () => void;
  icon?: React.ReactNode;
}

/** FileItem — regel met bestandsnaam, grootte en verwijderknop. */
export const FileItem = React.forwardRef<HTMLDivElement, FileItemProps>(function FileItem(
  { name, size, progress, onRemove, icon, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("pxui-fileitem", className)} {...rest}>
      <span className="pxui-fileitem-icon">{icon ?? <Icon name="file" size={17} />}</span>
      <div className="pxui-fileitem-body">
        <span className="pxui-fileitem-name">{name}</span>
        {size !== undefined && <span className="pxui-fileitem-size">{formatBytes(size)}</span>}
        {progress !== undefined && progress < 100 && (
          <span className="pxui-fileitem-progress">
            <span className="pxui-fileitem-progress-bar" style={{ width: `${progress}%` }} />
          </span>
        )}
      </div>
      {onRemove && (
        <button type="button" className="pxui-fileitem-remove" aria-label={`${name} verwijderen`} onClick={onRemove}>
          <Icon name="x" size={15} />
        </button>
      )}
    </div>
  );
});

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} kB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
