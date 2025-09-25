import { render } from "@testing-library/react";

import ScrollToTop from "@/components/ScrollToTop";

describe("ScrollToTop", () => {
  // Mock window.scrollTo
  const mockScrollTo = vi.fn();

  beforeEach(() => {
    // Reset the mock before each test
    mockScrollTo.mockClear();
    Object.defineProperty(window, "scrollTo", {
      value: mockScrollTo,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore the original scrollTo function
    vi.restoreAllMocks();
  });

  it("should call window.scrollTo with correct parameters on mount", () => {
    render(<ScrollToTop />);

    expect(mockScrollTo).toHaveBeenCalledTimes(1);
    expect(mockScrollTo).toHaveBeenCalledWith(0, 0);
  });

  it("should not render any visible content", () => {
    const { container } = render(<ScrollToTop />);

    expect(container.firstChild).toBeNull();
  });

  it("should call scrollTo only once per mount", () => {
    const { unmount } = render(<ScrollToTop />);

    expect(mockScrollTo).toHaveBeenCalledTimes(1);

    // Unmount and remount to verify it's called again
    unmount();
    render(<ScrollToTop />);

    expect(mockScrollTo).toHaveBeenCalledTimes(2);
  });

  it("should handle missing window.scrollTo gracefully", () => {
    // Remove scrollTo from window to test error handling
    const originalScrollTo = window.scrollTo;
    // @ts-expect-error - Testing error condition
    delete window.scrollTo;

    expect(() => {
      render(<ScrollToTop />);
    }).toThrow();

    // Restore scrollTo
    window.scrollTo = originalScrollTo;
  });

  it("should work with multiple instances", () => {
    render(
      <div>
        <ScrollToTop />
        <ScrollToTop />
      </div>
    );

    expect(mockScrollTo).toHaveBeenCalledTimes(2);
    expect(mockScrollTo).toHaveBeenNthCalledWith(1, 0, 0);
    expect(mockScrollTo).toHaveBeenNthCalledWith(2, 0, 0);
  });
});
