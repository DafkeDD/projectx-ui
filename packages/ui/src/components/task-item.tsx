"use client";
import * as React from "react";
import { cn } from "../lib/cn";
import { Icon } from "../icons/icon";
import { ConfettiBurst } from "./confetti";

export type TaskPriority = "none" | "low" | "normal" | "high";

export interface TaskMetaTag {
  icon?: React.ReactNode;
  label: React.ReactNode;
  /** Kleur van het label, bv. rood voor een verlopen deadline. */
  tone?: "neutral" | "accent" | "green" | "amber" | "red" | "blue" | "violet";
  /** Gekleurd bolletje vóór het label, bv. de kleur van een lijst. */
  dot?: string;
}

export interface TaskItemProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title" | "onToggle"> {
  title: React.ReactNode;
  done?: boolean;
  priority?: TaskPriority;
  /** Labels onder de titel: lijst, deadline, herhaling … */
  tags?: TaskMetaTag[];
  /** Voortgang van deeltaken, bv. { done: 2, total: 5 }. */
  progress?: { done: number; total: number };
  /** Wordt aangeroepen bij het aan- of afvinken. */
  onToggle?: (done: boolean) => void;
  /** Klik op de rij zelf. */
  onOpen?: () => void;
  /** Toont een verwijderknop; de rij schuift weg vóór de aanroep. */
  onDelete?: () => void;
  /** Confetti bij het afvinken. */
  celebrate?: boolean;
  /** Extra knoppen rechts. */
  actions?: React.ReactNode;
}

/**
 * TaskItem — één taak in een lijst: afvinken, prioriteit, labels en voortgang
 * van deeltaken. Bij het afvinken springt er confetti uit de knop.
 */
export const TaskItem = React.forwardRef<HTMLDivElement, TaskItemProps>(function TaskItem(
  {
    title,
    done = false,
    priority = "none",
    tags,
    progress,
    onToggle,
    onOpen,
    onDelete,
    celebrate = true,
    actions,
    className,
    children,
    ...rest
  },
  ref
) {
  const [burst, setBurst] = React.useState(false);
  const [removing, setRemoving] = React.useState(false);
  const wasDone = React.useRef(done);

  React.useEffect(() => {
    if (!wasDone.current && done && celebrate) setBurst(true);
    wasDone.current = done;
  }, [done, celebrate]);

  const remove = () => {
    setRemoving(true);
    window.setTimeout(() => onDelete?.(), 260);
  };

  return (
    <div
      ref={ref}
      data-done={done ? "" : undefined}
      data-removing={removing ? "" : undefined}
      className={cn("pxui-task", `pxui-task-prio-${priority}`, onOpen && "pxui-task-clickable", className)}
      onClick={onOpen}
      {...rest}
    >
      <span className="pxui-task-prio" aria-hidden="true" />

      <button
        type="button"
        role="checkbox"
        aria-checked={done}
        aria-label={done ? "Vinkje weghalen" : "Afvinken"}
        className="pxui-task-check"
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.(!done);
        }}
      >
        <Icon name="check" size={14} strokeWidth={3} />
        {burst && <ConfettiBurst onDone={() => setBurst(false)} />}
      </button>

      <div className="pxui-task-body">
        <div className="pxui-task-title">{title}</div>

        {(tags?.length || progress) && (
          <div className="pxui-task-meta">
            {tags?.map((tag, index) => (
              <span key={index} className={cn("pxui-task-tag", tag.tone && `pxui-task-tag-${tag.tone}`)}>
                {tag.dot && <span className="pxui-task-tag-dot" style={{ background: tag.dot }} />}
                {tag.icon}
                {tag.label}
              </span>
            ))}

            {progress && progress.total > 0 && (
              <span className="pxui-task-progress">
                <span className="pxui-task-progress-bar">
                  <i style={{ width: `${(progress.done / progress.total) * 100}%` }} />
                </span>
                {progress.done}/{progress.total}
              </span>
            )}
          </div>
        )}

        {children}
      </div>

      <div className="pxui-task-actions" onClick={(event) => event.stopPropagation()}>
        {actions}
        {onOpen && (
          <button type="button" className="pxui-task-action" aria-label="Openen" onClick={onOpen}>
            <Icon name="chevronRight" size={16} />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            className="pxui-task-action pxui-task-action-danger"
            aria-label="Verwijderen"
            onClick={remove}
          >
            <Icon name="trash" size={15} />
          </button>
        )}
      </div>
    </div>
  );
});

export interface TaskListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Rand en schaduw rond de lijst. */
  bordered?: boolean;
}

/** TaskList — container voor TaskItems. */
export const TaskList = React.forwardRef<HTMLDivElement, TaskListProps>(function TaskList(
  { bordered, className, ...rest },
  ref
) {
  return (
    <div ref={ref} className={cn("pxui-tasklist", bordered && "pxui-tasklist-bordered", className)} {...rest} />
  );
});
