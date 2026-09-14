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

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
  // Defaults to the home page; each test can override the value.
  usePathname: vi.fn(() => "/"),
  // No query string by default; each test can override the value.
  useSearchParams: vi.fn(() => new URLSearchParams()),
}));

// Mock SVG icon modules used as React components in tests
vi.mock("@/assets/icons/calendar.svg", () => ({
  default: (props: any) => React.createElement("svg", { ...props }),
}));
vi.mock("@/assets/icons/location.svg", () => ({
  default: (props: any) => React.createElement("svg", { ...props }),
}));

// jsdom implements neither pointer capture nor the `transform` property.
// vaul (the mobile menu panel) relies on both to handle dragging, so we
// polyfill them here to avoid false failures on a click inside the panel.
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = vi.fn();
  Element.prototype.releasePointerCapture = vi.fn();
  Element.prototype.hasPointerCapture = vi.fn(() => false);
}

const nativeGetComputedStyle = window.getComputedStyle.bind(window);
window.getComputedStyle = ((element: Element, pseudoElement?: string | null) => {
  const style = nativeGetComputedStyle(element, pseudoElement ?? undefined);
  if (!style.transform) {
    Object.defineProperty(style, "transform", { value: "none", configurable: true });
  }
  return style;
}) as typeof window.getComputedStyle;

// Global test setup
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string): MediaQueryList => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
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
