import { NewsletterSignupForm } from "src/components/NewsletterSignupForm";
import { act, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { submitNewsletterSignup } from "lib/submit-newsletter-signup";

jest.mock("lib/submit-newsletter-signup", () => ({
  submitNewsletterSignup: jest.fn(),
}));

const mockedSubmit = jest.mocked(submitNewsletterSignup);

const noopSuccess = {
  onSuccessDataReady: jest.fn(),
  onSuccessFlowComplete: jest.fn(),
};

describe("NewsletterSignupForm", () => {
  beforeEach(() => {
    mockedSubmit.mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("shows email validation error when email is missing on submit", async () => {
    const user = userEvent.setup();
    render(
      <NewsletterSignupForm {...noopSuccess} onSubmitFailed={jest.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      /email is required/i,
    );
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it("shows terms error when email is valid but terms not accepted", async () => {
    const user = userEvent.setup();
    render(
      <NewsletterSignupForm {...noopSuccess} onSubmitFailed={jest.fn()} />,
    );

    await user.type(
      screen.getByRole("textbox", { name: /e-mail/i }),
      "hello@example.com",
    );
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    expect(
      await screen.findByText(/you must accept the terms/i),
    ).toBeInTheDocument();
    expect(mockedSubmit).not.toHaveBeenCalled();
  });

  it("calls onSubmitFailed when submitNewsletterSignup rejects", async () => {
    const user = userEvent.setup();
    const onSubmitFailed = jest.fn();
    mockedSubmit.mockRejectedValueOnce(new Error("Network down"));

    render(
      <NewsletterSignupForm {...noopSuccess} onSubmitFailed={onSubmitFailed} />,
    );

    await user.type(
      screen.getByRole("textbox", { name: /e-mail/i }),
      "hello@example.com",
    );
    await user.click(
      within(
        screen.getByText(/by submitting this form/i).closest("label")!,
      ).getByRole("checkbox"),
    );
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() =>
      expect(onSubmitFailed).toHaveBeenCalledWith("Network down"),
    );
  });

  it("adds address lines up to limit and hides add button at max", async () => {
    const user = userEvent.setup();
    render(
      <NewsletterSignupForm {...noopSuccess} onSubmitFailed={jest.fn()} />,
    );

    expect(
      screen.getByRole("button", { name: /add another line/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add another line/i }));
    expect(
      screen.getByText(/you can add up to 3 address lines/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add another line/i }));
    expect(
      screen.queryByRole("button", { name: /add another line/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByText(/maximum number of address lines reached/i),
    ).toBeInTheDocument();
  });

  it("calls onSuccessDataReady immediately then onSuccessFlowComplete after success view delay", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onSuccessDataReady = jest.fn();
    const onSuccessFlowComplete = jest.fn();

    render(
      <NewsletterSignupForm
        onSuccessDataReady={onSuccessDataReady}
        onSuccessFlowComplete={onSuccessFlowComplete}
        onSubmitFailed={jest.fn()}
        onModalContentPhaseChange={jest.fn()}
      />,
    );

    await user.type(
      screen.getByRole("textbox", { name: /e-mail/i }),
      "hello@example.com",
    );
    await user.type(
      screen.getByRole("textbox", { name: /clinic - address line 1/i }),
      "Clinic A",
    );
    await user.click(
      within(
        screen.getByText(/by submitting this form/i).closest("label")!,
      ).getByRole("checkbox"),
    );
    await user.click(screen.getByRole("button", { name: /^submit$/i }));

    await waitFor(() => expect(mockedSubmit).toHaveBeenCalled());
    expect(onSuccessDataReady).toHaveBeenCalledWith({
      email: "hello@example.com",
      clinic: ["Clinic A"],
      acceptedTerms: true,
    });
    expect(onSuccessFlowComplete).not.toHaveBeenCalled();

    expect(
      await screen.findByRole("heading", { name: /you're all set/i }),
    ).toBeInTheDocument();

    await act(async () => {
      jest.advanceTimersByTime(3600);
    });

    expect(onSuccessFlowComplete).toHaveBeenCalledTimes(1);

    jest.useRealTimers();
  });
});
