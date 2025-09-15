// Auto-generated tests for Header component
import Header from "./Header";

describe("Header", () => {
  it("renders without crashing and shows the choir name", () => {
    render(<Header />);
    expect(screen.getByRole("heading", { level: 1, name: /Choeur des pays du Mont-Blanc/i })).toBeInTheDocument();
  });

  it("wraps heading inside a link to the homepage", () => {
    render(<Header />);
    const link = screen.getByRole("link", { name: /Choeur des pays du Mont-Blanc/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });

  it("includes the music note icon (SVG) and marks it aria-hidden", () => {
    render(<Header />);
    // The SVG should be present but hidden from accessibility tree

    const svg = screen.getByTestId("svg-mock");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden");
  });

  it("applies expected structural classes to the header element", () => {
    render(<Header />);
    const header = screen.getByRole("banner");
    // Check a few representative classes to avoid coupling to all Tailwind classes
    expect(header.className).toEqual(expect.stringContaining("sticky"));
    expect(header.className).toEqual(expect.stringContaining("border-b"));
    expect(header.className).toEqual(expect.stringContaining("bg-white"));
  });

  it("applies styling classes to the heading", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading.className).toEqual(expect.stringContaining("font-bold"));
    expect(heading.className).toEqual(expect.stringContaining("tracking-tighter"));
  });

  it("is accessible: heading is level 1 and link text matches heading", () => {
    render(<Header />);
    const heading = screen.getByRole("heading", { level: 1 });
    const link = screen.getByRole("link", { name: heading.textContent ?? "" });
    expect(link).toContainElement(heading);
  });

  it("matches snapshot of the semantic structure", () => {
    const { container } = render(<Header />);
    // Snapshot only of the header element to limit noise
    expect(container.querySelector("header")).toMatchSnapshot();
  });
});