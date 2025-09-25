import "@testing-library/jest-dom";

import React from "react";
import { vi } from "vitest";

// Mock Next.js Image component globally
vi.mock("next/image", () => ({
  default: (props: any) => {
    return React.createElement("img", {
      src: props.src,
      alt: props.alt,
      width: props.width,
      height: props.height,
      className: props.className,
    });
  },
}));

// Mock SVG icon modules used as React components in tests
vi.mock("@/assets/icons/calendar.svg", () => ({
  default: (props: any) => React.createElement("svg", { ...props }),
}));
vi.mock("@/assets/icons/location.svg", () => ({
  default: (props: any) => React.createElement("svg", { ...props }),
}));

// Global test setup
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation(
    (query: string): MediaQueryList => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(), // deprecated
      removeListener: vi.fn(), // deprecated
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })
  ),
});

// Mock IntersectionObserver with proper class implementation
class MockIntersectionObserver {
  private callback: IntersectionObserverCallback;

  constructor(callback: IntersectionObserverCallback) {
    this.callback = callback;
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Mock ResizeObserver with proper class implementation
class MockResizeObserver {
  private callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
}

// Assign to globalThis with type casting for strict TypeScript compliance
(globalThis as any).IntersectionObserver = MockIntersectionObserver;
(globalThis as any).ResizeObserver = MockResizeObserver;
