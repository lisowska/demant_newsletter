# Feedback for sparring session

This document is part of the task deliverables: feedback I will give in a sparring session with the Product Owner, Product Designer, or Frontend Developer. It stays close to **what the current app actually does**.

A **PDF version** (feedback/Feedback.pdf) contains the **same content** plus **screenshots** next to topics where visuals help (for example error messages and success states). PDF is often **easier to read offline** or outside GitHub than raw Markdown.

Below, **“What I shipped”** is only what exists in the codebase today. **“I would discuss”** is open questions for the team, not extra features I built.

---

## 1. Error states (inline, in the form)

**What I shipped:**

- **Email:** Red border on the field when there is an error; **error icon** and message **under** the field:
  - Empty: “Email is required”
  - Invalid format: “Please enter a valid email address”
- Errors are shown on **submit** if the user tries to send an invalid form. The email field also runs validation **when it loses focus (blur)** so feedback can appear after the user leaves the field.
- **Terms:** If the user submits without accepting the terms, a **red error line** with icon appears: “You must accept the terms and conditions.”

**I would discuss:**

- **Product Designer:** Exact **error colour**, typography, and spacing so they match the design system (I used existing tokens such as error styling in the build).
- **Product Designer:** Whether **terms** should show a **required marker** (for example `*`) next to the label text so required vs optional fields are obvious at a glance.

---

## 2. Error toast (submit failure)

**What I shipped:**

- If `submitNewsletterSignup` **rejects** (in the demo this is mocked; tests simulate a failure), an **error toast** appears with a **title** and the **error message**. The modal **stays open** so the user can fix the issue and try again.

**I would discuss:**

- **Product Designer:** Final **layout**, **icon**, duration, and **copy** for failure feedback.
- **Product Owner:** What message real users should see when the **API** fails (generic vs specific, support links, retry).

---

## 3. Success feedback (in-modal + toast)

**What I shipped:**

- After a **successful** submit, the modal shows a **short success screen** (“You’re all set!” and a short thank-you line).
- **Form Data Preview** on the page is updated **as soon as** the submit succeeds (before the success screen times out).
- After a **fixed delay**, a **success toast** appears and the **modal closes** automatically. The user can also close the modal earlier; the preview still keeps the submitted data.

**I would discuss:**

- **Product Designer:** Final **visual design** for the success step (it was not in the Figma extract I had, so this is a reasonable placeholder).
- **Product Owner:** Exact **copy**, especially if signup is **not final** until the user confirms by **email**—the message should say that clearly if it applies.
- **Product Owner:** Whether **auto-closing** the modal after success is wanted, or if the user should dismiss it manually.

---

## 4. Clinic / address fields

**What I shipped:**

- Address lines are **optional**. There is **no** validation of address **format** or country-specific rules.
- **Data Preview** shows **“—”** for clinic when there is nothing to show after submit (empty lines are not sent in the payload).

**I would discuss:**

- **Product Owner:** Is **structured address** needed (country, postcode, etc.) or is **free text** enough?
- **Product Owner:** Should we **validate** addresses at all, given different **postcode** formats per country?
- **Product Owner:** If the user sends **no** address, should the preview **hide** the clinic block entirely or keep a placeholder (today it shows “—”).

---

## 5. “Up to three address lines”

**What I shipped:**

- User can **add** lines with **“+ Add another line”**, up to **three** lines in total, and **remove** extra lines (not the only remaining line).
- When **two** lines are already present, helper text appears: **“You can add up to 3 address lines.”**
- At the **limit**, the add control is **hidden** and a message appears: **“Maximum number of address lines reached.”** (styled as a warning colour in the build).

**I would discuss:**

- **Product Designer:** Whether the **limit** should be **clear earlier** (for example a short hint under the first line), so users are not surprised only when they add a second line.
- **Product Designer:** Final colour and wording for the **“maximum reached”** state.

---

## 6. Labels vs placeholders (clinic fields)

**What I shipped:**

- First line label: **“Clinic - Address line 1”** with placeholder **“Enter clinic name and address”**.
- Further lines: **“Address line 2”** (etc.) with placeholder **“Enter clinic name”**.

**I would discuss:**

- **Product Designer / Product Owner:** The mix of **“address”** in the label and **“clinic name”** in the placeholder can feel **inconsistent**. Aligning **label, placeholder, and hint** with what we really collect (name only, full address, or both) would help users.

---

## 7. Privacy policy link

**What I shipped:**

- The consent block includes a **“Privacy policy”** link (opens in a new tab, brand link colour).

**I would discuss:**

- **Product Designer:** Confirm **link colour** and **underline** rules for the design system.
- **Product Owner:** Confirm the **correct URL** and legal text for Demant / Oticon.

---

## 8. Form Data Preview (after submit)

**What I shipped:**

- Preview shows **email**, **clinic** lines (list), and **Accepted terms** (Yes/No).

**I would discuss:**

- **Product Owner:** Should users **edit** data after submit from this screen, or is it **read-only** feedback for the task only?
- **Product Designer:** Whether small **icons** next to fields would help scanning (not in the current build).

**PDF note:** I added a **screenshot mock-up** of how that preview _could_ look with icons—only a **design idea for the sparring session**, not something implemented in the app.

---

## 9. Forms and backend (engineering / product)

**What I shipped:**

- Form state is handled with **React state** in the component. Submit calls **`submitNewsletterSignup`**, which today is a **simulated delay** and **does not** send data to a real server.

**I would discuss:**

- **Frontend Developer:** Preferred **form library** (if any) for larger validation—**React Hook Form**, **Formik**, or stay with local state for small forms.
- **Product Owner / Frontend Developer:** **Where** data should be stored (CRM, newsletter tool, API), **privacy**, and **double opt-in** if required.

---

## 10. Modal behaviour

**What I shipped:**

- The dialog can be closed with the **close control** (top right), by **clicking the dark overlay** outside the panel, and with the **Escape** key.
- The form is **reset when the modal closes without a successful submit** (the form remounts when you open the modal again).

**I would discuss:**

- **Product Designer:** Any details not visible in Figma (spacing, motion, breakpoint behaviour) so the live modal matches the source of truth.
- **Frontend Developer:** Whether overlay click should always close (some products avoid accidental closes for long forms).

---

## 11. Focus behaviour

**What I shipped:**

- When the form opens, **focus moves to the email field**.
- When the modal closes, **focus returns to the “Show modal” button** so keyboard users know where they are on the page.

**I would discuss :**

- **Product Designer / Frontend Developer:** Whether we need **stricter focus management** inside the dialog (for example keeping tab order inside the modal only). The current implementation does the basics above; a full “focus trap” was not a stated requirement in the brief I used.

---

## Summary lists for the session:

**Product Designer**

- Error colours and patterns for fields and terms.
- Behaviour and copy when the **address line limit** is reached; maybe earlier hint about the limit.
- Success step and toasts (layout, copy, motion).
- Mobile layout and interactions for the modal and form.
- Consistency of **labels, placeholders, and required markers** (especially terms).

**Product Owner**

- Business need for **clinic address**, format, and validation.
- **Preview vs real persistence**; what happens after submit in production.
- **Success / legal copy** (including email confirmation if needed).
- **Error messaging** policy for real API failures.

**Frontend Developer**

- Form stack choice for future iterations.
- Modal patterns (overlay close, focus scope) and alignment with existing internal components.
