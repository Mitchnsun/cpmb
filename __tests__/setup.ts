import "@testing-library/jest-dom";

import { vi } from "vitest";

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
