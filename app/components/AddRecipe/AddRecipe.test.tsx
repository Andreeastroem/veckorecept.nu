/** @jest-environment jsdom */

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import AddRecipe from "./AddRecipe";

function mockMatchMedia(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: matches && query === "(min-width: 768px)",
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

describe("AddRecipe component", () => {
  test("renders a Dialog on desktop screens", () => {
    mockMatchMedia(true);
    const { container } = render(<AddRecipe />);
    expect(container.querySelector('[data-slot="dialog"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="drawer"]')).toBeNull();
  });

  test("renders a Drawer on mobile screens", () => {
    mockMatchMedia(false);
    const { container } = render(<AddRecipe />);
    expect(container.querySelector('[data-slot="drawer"]')).not.toBeNull();
    expect(container.querySelector('[data-slot="dialog"]')).toBeNull();
  });

  test("TriggerButton calls setIsOpen(true) when clicked", () => {
    mockMatchMedia(true);
    render(<AddRecipe />);

    const trigger = screen.getByRole("button", { name: /add recipe/i });
    fireEvent.click(trigger);

    expect(screen.queryByText(/Recipe link form/i)).not.toBeNull();
  });

  test("AddRecipeForm calls setIsOpen(false) when the cancel button is clicked", () => {
    mockMatchMedia(true);
    render(<AddRecipe />);

    const trigger = screen.getByRole("button", { name: /add recipe/i });
    fireEvent.click(trigger);

    // Ensure open
    expect(screen.queryByText(/Recipe link form/i)).not.toBeNull();

    const cancel = screen.getByRole("button", { name: /cancel/i });
    fireEvent.click(cancel);

    // After cancel, the dialog content should close
    expect(screen.queryByText(/Recipe link form/i)).toBeNull();
  });
});