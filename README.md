## Getting started

Quick steps to run the app on your machine.

1. **Install dependencies**

```bash
npm install
```

2. **Run the dev server**

```bash
npm run dev
```

3. **Open the app**

By default Next starts on [`http://localhost:3000`](http://localhost:3000) – open this URL in your browser.

## Live demo

Replace the link below with your real Vercel deployment URL once the project is connected.

Deployed on Vercel: `https://`

## Project summary

A small Next.js page for a newsletter-style signup: a **data preview** on the page, a **modal** with the form, and **toasts** for success and errors. Submitting the form uses a **fake delay** (simulated API) so the UI can show loading and success states without a backend.

## UI integration

The screen uses the **Demant logo**, a **decorative background** (SVG shape + grey canvas), and **shared UI pieces**: a primary **Button**, a **Modal** with focus trap and escape/overlay close, **AppToast** for feedback, and **DataPreview** bound to the latest submitted values. Form layout follows the task layout (hero image, fields, terms, submit).

## UX decisions

- **Validation** on submit (and sensible messages), not on every keystroke for email.
- **Focus returns** to “Show modal” when the dialog closes so keyboard users always know where they are on the page.
- **Success path**: the **preview updates as soon as** the submit succeeds; the **success screen stays visible briefly**, then a **toast** appears and the **modal closes**. If the user closes early, the preview still shows the new data.
- **Errors** use a toast with a clear title and the error message; the form stays open so the user can fix and retry.
- **Fresh form** each time the modal is closed (form remounts), as required by the task brief.

## Scenario / user flow

1. Open the page — empty preview and a **Show modal** button.
2. Open the modal — newsletter form (email, up to three clinic lines, terms, submit).
3. Submit with mistakes — inline errors (e.g. missing email, terms not accepted).
4. Submit successfully — short loading state, **success view**, then toast + auto-close; **preview** shows email, clinic lines, and terms acceptance.
5. Failed submit (e.g. mocked network error) — **error toast**, modal stays open.

## Architectural overview

- **Next.js** (Pages Router) — single home page in `src/pages/index.tsx`.
- **State on the page**: modal open/close, preview data, toast, modal width phase (form vs success content).
- **NewsletterSignupForm** owns form state and validation; it calls **`submitNewsletterSignup`** (simulated `Promise` in `src/lib`) and notifies the parent via **`onSuccessDataReady`**, **`onSuccessFlowComplete`**, **`onSubmitFailed`**, and **`onModalContentPhaseChange`**.
- **Unit tests** (Jest + Testing Library) cover the form and modal/toast pieces.

## Style

**Tailwind-style utility classes** in components plus **global SCSS** (`src/styles`) with **design tokens** (e.g. greys, primary link colour, typography scale). Rounded cards, spacing, and focus rings keep the UI consistent with the brand palette without ad-hoc colours in every file.
