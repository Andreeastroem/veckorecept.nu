/** @jest-environment jsdom */

import { renderHook } from "@testing-library/react";
import { useMediaQuery } from "./useMediaQuery";

function setMatchMediaImpl(impl: (query: string) => boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: impl(query),
      media: query,
      onchange: null,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      addListener: jest.fn(),
      removeListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
}

describe("useMediaQuery", () => {
  test("returns true for matching queries", () => {
    setMatchMediaImpl((q) => q === "(min-width: 768px)");
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(true);
  });

  test("returns false for non-matching queries", () => {
    setMatchMediaImpl(() => false);
    const { result } = renderHook(() => useMediaQuery("(min-width: 768px)"));
    expect(result.current).toBe(false);
  });
});