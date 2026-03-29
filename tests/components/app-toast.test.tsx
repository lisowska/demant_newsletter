import { AppToast } from "src/components/AppToast";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("AppToast", () => {
  it("renders nothing when toast is null", () => {
    const { container } = render(
      <AppToast toast={null} onDismiss={jest.fn()} />,
    );
    expect(container.firstChild).toBeNull();
  });

  it("shows success title, body, and status role", () => {
    render(
      <AppToast
        toast={{
          kind: "success",
          title: "Saved",
          body: "Your changes are stored.",
        }}
        onDismiss={jest.fn()}
      />,
    );

    const region = screen.getByRole("status");
    expect(within(region).getByText("Saved")).toBeInTheDocument();
    expect(
      within(region).getByText("Your changes are stored."),
    ).toBeInTheDocument();
  });

  it("uses alert role for error toasts", () => {
    render(
      <AppToast
        toast={{ kind: "error", title: "Failed", body: "Nope" }}
        onDismiss={jest.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("Failed")).toBeInTheDocument();
  });

  it("calls onDismiss when close button is clicked", async () => {
    const user = userEvent.setup();
    const onDismiss = jest.fn();
    render(
      <AppToast
        toast={{ kind: "error", title: "Error" }}
        onDismiss={onDismiss}
      />,
    );

    await user.click(
      screen.getByRole("button", { name: /dismiss notification/i }),
    );

    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it("auto-dismisses success toasts after timeout", () => {
    jest.useFakeTimers();
    const onDismiss = jest.fn();
    render(
      <AppToast
        toast={{ kind: "success", title: "OK" }}
        onDismiss={onDismiss}
      />,
    );

    jest.advanceTimersByTime(4000);

    expect(onDismiss).toHaveBeenCalledTimes(1);
    jest.useRealTimers();
  });
});
