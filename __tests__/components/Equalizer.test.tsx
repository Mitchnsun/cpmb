import { render } from "@testing-library/react";

import Equalizer from "@/components/Equalizer";

describe("Equalizer", () => {
  it("should be hidden from screen readers", () => {
    const { container } = render(<Equalizer />);

    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("should render nine breathing bars with distinct durations and delays", () => {
    const { container } = render(<Equalizer />);

    const bars = [...(container.firstElementChild?.children ?? [])] as HTMLElement[];
    expect(bars).toHaveLength(9);

    const durations = bars.map((bar) => bar.style.animationDuration);
    const delays = bars.map((bar) => bar.style.animationDelay);

    expect(new Set(durations).size).toBe(9);
    expect(new Set(delays).size).toBe(9);
    durations.forEach((duration) => {
      const seconds = Number.parseFloat(duration);
      expect(seconds).toBeGreaterThanOrEqual(2.1);
      expect(seconds).toBeLessThanOrEqual(3.2);
    });
    delays.forEach((delay) => {
      const seconds = Number.parseFloat(delay);
      expect(seconds).toBeGreaterThanOrEqual(0);
      expect(seconds).toBeLessThanOrEqual(1.4);
    });
    bars.forEach((bar) => expect(bar).toHaveClass("animate-breathe", "origin-bottom"));
  });
});
