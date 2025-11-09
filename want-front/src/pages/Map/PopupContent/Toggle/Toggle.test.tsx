import { render } from "@testing-library/react";
import { fireEvent, screen } from "@testing-library/dom";
import Toggle from "./Toggle";
import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";
import * as notificationStore from "../../../../store/notification";

// mock modules
vi.mock("../../../../store/notification", () => ({
  useNotificationStore: vi.fn(() => ({
    markAsRead: vi.fn(),
    isRead: false,
  })),
}));
vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));
vi.mock("@/assets/svg/toggle_arrow.svg", () => ({
  default: () => <svg data-testid="arrow-icon" />,
}));
vi.mock("../../DescriptionBox/DescriptionBox", () => ({
  default: ({ text }: { text: string }) => <div>{text}</div>,
}));

describe("Toggle component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render title and content", () => {
    // Arrange
    render(<Toggle title="Title" content={["item1", "item2"]} />);

    // Assert
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("item1")).toBeInTheDocument();
    expect(screen.getByText("item2")).toBeInTheDocument();
  });

  it("should open/close when clicked", () => {
    // Arrange
    render(<Toggle title="Toggle Test" content={["Content 1"]} />);
    const button = screen
      .getByText("Toggle Test")
      .closest("div") as HTMLElement;
    const menu = screen
      .getByText("Content 1")
      .closest(".Toggle__menu") as HTMLElement;

    // Act / Assert
    // initial (close)
    expect(menu?.classList.contains("isOpen")).toBe(false);

    fireEvent.click(button);
    expect(menu?.classList.contains("isOpen")).toBe(true);

    fireEvent.click(button);
    expect(menu?.classList.contains("isOpen")).toBe(false);
  });

  it("should shows dot indicator when isNotifMode=true and isRead=false", () => {
    // Arrange
    render(
      <Toggle title="Notification" content={["content 1"]} isNotifMode={true} />
    );

    // Assert
    expect(screen.getByText("•")).toBeInTheDocument();
  });

  it("should calls markAsRead when toggled in notif mode", () => {
    // Arrange
    const mockMarkAsRead = vi.fn();
    (notificationStore.useNotificationStore as unknown as Mock).mockReturnValue(
      {
        markAsRead: mockMarkAsRead,
        isRead: false,
      }
    );

    render(<Toggle title="Notif" content={["content 1"]} isNotifMode={true} />);
    const button = screen.getByText("Notif").closest("div") as HTMLElement;

    // --- Act ---
    fireEvent.click(button);

    // --- Assert ---
    expect(mockMarkAsRead).toHaveBeenCalled();
  });

  it('should show "no-notifications" message when content is empty', () => {
    // Arrange
    render(<Toggle title="Title" content={[]} />);

    // Assert
    expect(screen.getByText("no-notifications")).toBeInTheDocument();
  });
});
