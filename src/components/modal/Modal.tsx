import clsx from "clsx";
import PortalRootLoader from "components/modal/PortalRootLoader";
import {
  FunctionComponent,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";

export type ModalContentPhase = "form" | "success";

type Props = {
  isOpen: boolean;
  children: ReactNode;
  onClose: () => void;
  titleId?: string;
  width?: number | string;
  overlayClassNames?: string;
  contentPhase?: ModalContentPhase;
};

const Modal: FunctionComponent<Props> = ({
  children,
  isOpen,
  onClose: handleClose,
  titleId = "newsletter-modal-title",
  width = undefined,
  overlayClassNames = undefined,
  contentPhase = "form",
}) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const closeOnEscapeKey = (e: KeyboardEvent) =>
      e.key === "Escape" && isOpen ? handleClose() : null;

    document.body.addEventListener("keydown", closeOnEscapeKey);

    return () => {
      document.body.removeEventListener("keydown", closeOnEscapeKey);
    };
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (isOpen) {
      setLoaded(true);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const contentStyles =
    width !== undefined
      ? {
          width,
          maxWidth: width,
        }
      : undefined;

  if (!isOpen) return null;

  return (
    <PortalRootLoader loaded={loaded} wrapperId="react-portal-modal-container">
      <div
        className={clsx(
          overlayClassNames,
          "fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 py-8",
        )}
        role="presentation"
        onClick={handleClose}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          className={clsx(
            "relative max-h-[90vh] w-full overflow-hidden rounded-4 bg-white shadow-2xl",
            contentPhase === "success" ? "max-w-[24rem]" : "max-w-[760px]",
          )}
          style={contentStyles}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary-weblink shadow-md transition hover:bg-grey-0950 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink focus-visible:ring-offset-2"
            aria-label="Close dialog"
          >
            <span className="text-lg leading-none" aria-hidden>
              ×
            </span>
          </button>

          <div className="max-h-[90vh] overflow-y-auto">{children}</div>
        </div>
      </div>
    </PortalRootLoader>
  );
};

export default Modal;
