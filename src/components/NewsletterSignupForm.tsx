import clsx from "clsx";
import heroImage from "assets/background_black.png";
import Image from "next/image";
import CheckmarkIcon from "images/checkmark.svg";
import TrashIcon from "images/trash.svg";
import { submitNewsletterSignup } from "lib/submit-newsletter-signup";
import { FormDataDTO } from "models/FormDataDTO";
import {
  FormEvent,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

const MAX_CLINIC_LINES = 3;

function clinicLineLabel(index: number): string {
  if (index === 0) return "Clinic - Address line 1";
  return `Address line ${index + 1}`;
}

function clinicLinePlaceholder(index: number): string {
  if (index === 0) return "Enter clinic name and address";
  return "Enter clinic name";
}

function isValidEmail(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed);
}

function emailValidationMessage(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return "Email is required";
  if (!isValidEmail(trimmed)) return "Please enter a valid email address";
  return null;
}

function ErrorIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-error"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function TermsCheckboxCheckIcon() {
  return (
    <svg
      className="h-3 w-3 text-primary-weblink"
      viewBox="0 0 12 10"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 5.5L4.5 9L11 1.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function buildFormPayload(
  emailValue: string,
  lines: string[],
  termsAccepted: boolean,
): FormDataDTO {
  return {
    email: emailValue.trim(),
    clinic: lines.map((l) => l.trim()).filter((l) => l.length > 0),
    acceptedTerms: termsAccepted,
  };
}

const SUCCESS_VIEW_MS = 3600;

export type NewsletterModalContentPhase = "form" | "success";

export interface NewsletterSignupFormProps {
  onSuccessDataReady: (data: FormDataDTO) => void;
  onSuccessFlowComplete: () => void;
  onSubmitFailed: (message: string) => void;
  onModalContentPhaseChange?: (phase: NewsletterModalContentPhase) => void;
}

export function NewsletterSignupForm({
  onSuccessDataReady,
  onSuccessFlowComplete,
  onSubmitFailed,
  onModalContentPhaseChange,
}: NewsletterSignupFormProps) {
  const emailId = useId();
  const emailErrorId = useId();
  const clinicFieldIdPrefix = useId();
  const termsId = useId();
  const termsErrorId = useId();
  const emailInputRef = useRef<HTMLInputElement>(null);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [clinicLines, setClinicLines] = useState<string[]>([""]);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [termsError, setTermsError] = useState<string | null>(null);
  const [phase, setPhase] = useState<"form" | "submitting" | "success">("form");

  const emailOk = isValidEmail(email);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (phase !== "success") return;
    const timeoutId = window.setTimeout(() => {
      onSuccessFlowComplete();
    }, SUCCESS_VIEW_MS);
    return () => window.clearTimeout(timeoutId);
  }, [phase, onSuccessFlowComplete]);

  useLayoutEffect(() => {
    onModalContentPhaseChange?.(phase === "success" ? "success" : "form");
  }, [phase, onModalContentPhaseChange]);

  function handleEmailBlur() {
    setEmailError(emailValidationMessage(email));
  }

  function handleEmailChange(value: string) {
    setEmail(value);
    if (emailError) setEmailError(null);
  }

  function handleTermsChange(checked: boolean) {
    setAcceptedTerms(checked);
    if (checked) setTermsError(null);
  }

  function addClinicLine() {
    setClinicLines((lines) =>
      lines.length < MAX_CLINIC_LINES ? [...lines, ""] : lines,
    );
  }

  function removeClinicLine(index: number) {
    setClinicLines((lines) => lines.filter((_, i) => i !== index));
  }

  function setClinicLineValue(index: number, value: string) {
    setClinicLines((lines) =>
      lines.map((line, i) => (i === index ? value : line)),
    );
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const nextEmailError = emailValidationMessage(email);
    setEmailError(nextEmailError);
    if (nextEmailError) return;

    if (!acceptedTerms) {
      setTermsError("You must accept the terms and conditions.");
      return;
    }

    setPhase("submitting");
    try {
      await submitNewsletterSignup();
      const payload = buildFormPayload(email, clinicLines, acceptedTerms);
      onModalContentPhaseChange?.("success");
      onSuccessDataReady(payload);
      setPhase("success");
    } catch (err) {
      setPhase("form");
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";
      onSubmitFailed(message);
    }
  }

  if (phase === "success") {
    return (
      <div
        className="mx-auto flex min-h-[min(320px,55vh)] w-full max-w-[17.5rem] flex-col items-center justify-center gap-6 bg-white px-6 py-16 text-center sm:max-w-[18.5rem] md:gap-8 md:px-8 md:py-20"
        role="status"
        aria-live="polite"
        aria-atomic="true"
      >
        <div
          className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-full bg-success-light ring-2 ring-success/35"
          aria-hidden
        >
          <CheckmarkIcon className="h-8 w-8 text-success" />
        </div>
        <h2
          id="newsletter-modal-title"
          className="text-balance text-head-3 font-semibold text-grey-0100"
        >
          You&apos;re all set!
        </h2>
        <p className="w-full text-pretty text-regular text-grey-0250">
          Thanks for signing up for our newsletter.
        </p>
      </div>
    );
  }

  return (
    <div className="grid min-h-[min(520px,85vh)] grid-cols-1 md:grid-cols-2 md:min-h-0">
      <div className="relative flex min-h-0 flex-col border-l-[3px] border-l-primary-weblink bg-white px-8 py-8 md:max-h-[min(90vh,680px)] md:px-10 md:py-10">
        <div className="shrink-0">
          <h2
            id="newsletter-modal-title"
            className="text-balance font-medium text-head-3 text-grey-0100"
          >
            Want to see the unseen?
          </h2>
          <p className="mt-4 text-balance text-pretty text-subhead-1 text-grey-0300">
            A gamechanger is coming.
            <br />
            Get ready for the impossible made possible.
          </p>
        </div>

        <div className="mt-8 min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 [-webkit-overflow-scrolling:touch]">
          <form
            className="flex flex-col gap-6 pb-2"
            onSubmit={handleSubmit}
            noValidate
            aria-busy={phase === "submitting"}
          >
            <div className="flex flex-col gap-2">
              <label
                className="font-medium text-small text-grey-0100"
                htmlFor={emailId}
              >
                E-mail<span className="text-error">*</span>
              </label>
              <input
                ref={emailInputRef}
                id={emailId}
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter e-mail"
                value={email}
                onChange={(e) => handleEmailChange(e.target.value)}
                onBlur={handleEmailBlur}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? emailErrorId : undefined}
                className={clsx(
                  "rounded-[0.5rem] border bg-grey-0950 px-4 py-3 text-small text-grey-0100",
                  "placeholder:text-grey-0500",
                  "focus:outline-none focus:ring-2",
                  emailError
                    ? "border-error focus:border-error focus:ring-error/25"
                    : "border-transparent focus:border-primary-weblink focus:ring-primary-weblink/25",
                )}
              />
              {emailError ? (
                <p
                  id={emailErrorId}
                  role="alert"
                  className="flex items-start gap-2 text-tiny text-error"
                >
                  <ErrorIcon />
                  {emailError}
                </p>
              ) : null}
            </div>

            {clinicLines.map((line, index) => {
              const fieldId = `${clinicFieldIdPrefix}-${index}`;
              const showRemove = index > 0;

              return (
                <div key={index} className="flex flex-col gap-2">
                  <label
                    className="font-medium text-small text-grey-0100"
                    htmlFor={fieldId}
                  >
                    {clinicLineLabel(index)}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      id={fieldId}
                      name={`clinicLine-${index}`}
                      type="text"
                      autoComplete={index === 0 ? "street-address" : "off"}
                      placeholder={clinicLinePlaceholder(index)}
                      value={line}
                      onChange={(e) =>
                        setClinicLineValue(index, e.target.value)
                      }
                      className={clsx(
                        "min-w-0 flex-1 rounded-[0.5rem] border border-transparent bg-grey-0950 px-4 py-3 text-small text-grey-0100",
                        "placeholder:text-grey-0500",
                        "focus:border-primary-weblink focus:outline-none focus:ring-2 focus:ring-primary-weblink/25",
                      )}
                    />
                    {showRemove ? (
                      <button
                        type="button"
                        onClick={() => removeClinicLine(index)}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-5 text-grey-0250 transition hover:bg-grey-0950 hover:text-error focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink"
                        aria-label={`Remove ${clinicLineLabel(index)}`}
                      >
                        <TrashIcon className="h-6 w-6" aria-hidden />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {clinicLines.length < MAX_CLINIC_LINES ? (
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={addClinicLine}
                  aria-describedby={
                    clinicLines.length === 2
                      ? `${clinicFieldIdPrefix}-limit-hint`
                      : undefined
                  }
                  className="self-start text-left text-small font-medium text-primary-weblink hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink focus-visible:ring-offset-2"
                >
                  + Add another line
                </button>
                {clinicLines.length === 2 ? (
                  <p
                    className="text-pretty text-tiny text-grey-0500"
                    id={`${clinicFieldIdPrefix}-limit-hint`}
                  >
                    You can add up to 3 address lines.
                  </p>
                ) : null}
              </div>
            ) : (
              <p
                className="-mt-4 text-pretty text-tiny text-warning"
                role="status"
                aria-live="polite"
              >
                Maximum number of address lines reached.
              </p>
            )}

            <div className="flex flex-col gap-3">
              <label
                htmlFor={termsId}
                className="flex cursor-pointer gap-3 text-pretty text-tiny leading-snug text-grey-0250"
              >
                <input
                  id={termsId}
                  name="terms"
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => handleTermsChange(e.target.checked)}
                  aria-invalid={termsError ? true : undefined}
                  aria-describedby={termsError ? termsErrorId : undefined}
                  className="peer sr-only"
                />
                <span
                  className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-[0.35rem] bg-grey-0950 transition-colors peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-primary-weblink peer-focus-visible:ring-offset-2"
                  aria-hidden
                >
                  {acceptedTerms ? <TermsCheckboxCheckIcon /> : null}
                </span>
                <span className="min-w-0">
                  By submitting this form, you agree to receive marketing
                  communications from Oticon A/S regarding our products,
                  services, promotions, and events by email and/or by phone You
                  can unsubscribe at any time by clicking the unsubscribe link,
                  by sending an email to privacy@demant.com or by informing us
                  during a phone call. If you want to learn more about how we
                  process your data, please see{" "}
                  <a
                    href="https://www.oticon.global/About-us/Privacy-policy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary-weblink underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink focus-visible:ring-offset-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy policy
                  </a>
                  .
                </span>
              </label>
              {termsError ? (
                <p
                  id={termsErrorId}
                  role="alert"
                  className="flex items-start gap-2 text-tiny text-error"
                >
                  <ErrorIcon />
                  {termsError}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={!emailOk || phase === "submitting"}
              className={clsx(
                "mt-2 w-full rounded-5 py-3 text-center text-small font-medium text-white transition focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink focus-visible:ring-offset-2",
                emailOk && phase !== "submitting"
                  ? "bg-primary-weblink hover:opacity-95 active:scale-[0.99]"
                  : "cursor-not-allowed bg-primary-weblink/40",
              )}
            >
              {phase === "submitting" ? "Submitting…" : "Submit"}
            </button>
          </form>
        </div>
      </div>

      <div className="relative hidden min-h-[240px] bg-black md:block">
        <Image
          src={heroImage}
          alt=""
          fill
          className="object-cover object-center"
          sizes="(min-width: 768px) 380px, 100vw"
          priority
        />
      </div>
    </div>
  );
}
