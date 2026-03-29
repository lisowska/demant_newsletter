import clsx from "clsx";
import { useEffect } from "react";

export interface AppToastState {
  kind: "success" | "error";
  title: string;
  body?: string;
}

interface Props {
  toast: AppToastState | null;
  onDismiss: () => void;
}

const SUCCESS_MS = 4000;

function ToastStatusIcon({ kind }: { kind: "success" | "error" }) {
  if (kind === "success") {
    return (
      <span
        className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#43D29E] text-white"
        aria-hidden
      >
        <svg width="14" height="11" viewBox="0 0 14 11" fill="none" aria-hidden>
          <path
            d="M1 5.5L5 9.5L13 1"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    );
  }

  return (
    <span
      className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#EF4444] text-[0.875rem] font-bold leading-none text-white"
      aria-hidden
    >
      !
    </span>
  );
}

function ToastCloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1 1L11 11M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppToast({ toast, onDismiss }: Props) {
  useEffect(() => {
    if (!toast || toast.kind !== "success") return;
    const id = window.setTimeout(onDismiss, SUCCESS_MS);
    return () => window.clearTimeout(id);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      className="pointer-events-none fixed inset-x-0 bottom-0 z-[250] flex justify-center px-4 pb-8"
      role={toast.kind === "error" ? "alert" : "status"}
      aria-live={toast.kind === "error" ? "assertive" : "polite"}
    >
      <div
        className={clsx(
          "pointer-events-auto flex w-full max-w-md items-center gap-3 rounded-[0.625rem] border px-5 py-4",
          toast.kind === "success"
            ? "border-[#60D3A8] bg-[#E6F7F1] text-grey-0100"
            : "border-[#F5A8B0] bg-[#FEF2F2] text-grey-0100",
        )}
      >
        <ToastStatusIcon kind={toast.kind} />
        <div className="min-w-0 flex-1">
          <p className="font-medium text-small">{toast.title}</p>
          {toast.body ? (
            <p className="mt-1 text-pretty text-tiny text-grey-0250">
              {toast.body}
            </p>
          ) : null}
        </div>
        <button
          type="button"
          onClick={onDismiss}
          className={clsx(
            "flex size-11 shrink-0 items-center justify-center rounded-[0.5rem] text-grey-0100",
            "transition-colors hover:bg-black/[0.06] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink focus-visible:ring-offset-2",
          )}
          aria-label="Dismiss notification"
        >
          <ToastCloseIcon />
        </button>
      </div>
    </div>
  );
}
