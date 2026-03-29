import clsx from "clsx";
import { forwardRef, ReactNode } from "react";

export enum ButtonType {
  Button = "Button",
  Submit = "Submit",
}

export interface ButtonProps {
  label: string;
  children?: ReactNode;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  type?: ButtonType;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    label,
    type = ButtonType.Button,
    children = undefined,
    className,
    disabled,
    onClick,
  },
  ref,
) {
  const content = children ?? label;

  return (
    <button
      ref={ref}
      type={type === ButtonType.Submit ? "submit" : "button"}
      style={{ pointerEvents: disabled ? "none" : undefined }}
      className={clsx(
        "bg-primary-weblink text-white text-small px-4 py-2 rounded-5",
        className,
      )}
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-disabled={disabled}
    >
      {content}
    </button>
  );
});

export default Button;
