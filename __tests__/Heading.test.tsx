import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import Heading from "@/components/Heading";

describe("Heading Component", () => {
  it("should render with default h1 level and styles", () => {
    render(<Heading>Test Title</Heading>);
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Test Title");
    expect(title).toHaveClass("font-bold", "tracking-tight", "text-xl", "text-sky-700");
  });

  it("should render different heading levels", () => {
    render(<Heading hLevel={2}>H2 Title</Heading>);
    const title = screen.getByRole("heading", { level: 2 });
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("H2 Title");
  });

  it("should apply custom className along with variant styles", () => {
    render(
      <Heading className="text-red-500" hLevel={1}>
        Custom Title
      </Heading>
    );
    const title = screen.getByRole("heading", { level: 1 });
    expect(title).toHaveClass("text-red-500", "font-bold", "text-xl");
  });

  it("should accept and apply HTML attributes", () => {
    render(
      <Heading
        id="custom-heading"
        data-testid="test-heading"
        title="Tooltip text"
        aria-describedby="description"
        onClick={() => {}}
      >
        HTML Props Test
      </Heading>
    );

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveAttribute("id", "custom-heading");
    expect(heading).toHaveAttribute("data-testid", "test-heading");
    expect(heading).toHaveAttribute("title", "Tooltip text");
    expect(heading).toHaveAttribute("aria-describedby", "description");
  });

  it("should handle click event properly", async () => {
    const handleClick = vi.fn();

    render(<Heading onClick={handleClick}>Interactive Heading</Heading>);

    const heading = screen.getByRole("heading", { level: 1 });

    await userEvent.click(heading);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
  it("should apply correct styles for different variants", () => {
    const { rerender } = render(
      <Heading variant={2} hLevel={2}>
        Variant 2
      </Heading>
    );
    let heading = screen.getByRole("heading", { level: 2 });
    expect(heading).toHaveClass("font-noto", "text-lg", "text-gray-800");

    rerender(
      <Heading variant={3} hLevel={3}>
        Variant 3
      </Heading>
    );
    heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveClass("text-lg");
  });
});
