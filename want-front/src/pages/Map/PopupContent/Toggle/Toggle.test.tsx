import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Toggle from "./Toggle";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock("@/assets/svg/toggle_arrow.svg", () => ({
  default: () => <svg data-testid="toggle-arrow"></svg>,
}));

describe("Toggle Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders title", () => {
    render(<Toggle title="My Toggle" content={["item1"]} />);
    expect(screen.getByText("My Toggle")).toBeInTheDocument();
  });

  it("should open and close when clicked", () => {
    // Arrange
    render(<Toggle title="Toggle Test" content={["item1", "item2"]} />);
    const button = screen.getByRole("button");
    const menu = screen
      .getByText("item1")
      .closest(".Toggle__menu") as HTMLElement;

    // Assert
    expect(menu).not.toHaveClass("isOpen");

    // Act, Assert
    fireEvent.click(button);
    expect(menu).toHaveClass("isOpen");

    // Act, Assert
    fireEvent.click(button);
    expect(menu).not.toHaveClass("isOpen");
  });

  it("renders content items", () => {
    render(<Toggle title="Test" content={["aaa", "bbb"]} />);

    expect(screen.getByText("aaa")).toBeInTheDocument();
    expect(screen.getByText("bbb")).toBeInTheDocument();
  });
});
