import { render } from "@testing-library/react";

import Footer from "@/components/Footer";

describe("Footer", () => {
  beforeEach(() => {
    // Mock Date.getFullYear() to return a consistent year for testing
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should render the footer element", () => {
    const { container } = render(<Footer />);

    expect(container).toMatchSnapshot();
  });
});
