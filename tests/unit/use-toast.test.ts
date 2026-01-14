import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useToast, toast, resetToastState, TOAST_REMOVE_DELAY } from "../../hooks/use-toast";

describe("useToast", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    resetToastState();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should add a toast", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Test toast" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Test toast");
    expect(result.current.toasts[0].open).toBe(true);
  });

  it("should respect TOAST_LIMIT of 1", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Toast 1" });
      result.current.toast({ title: "Toast 2" });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Toast 2");
  });

  it("should dismiss a specific toast", () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const { id } = result.current.toast({ title: "Test toast" });
      toastId = id;
    });

    act(() => {
      result.current.dismiss(toastId);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it("should dismiss all toasts when no toastId provided", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Toast 1" });
    });

    act(() => {
      result.current.dismiss();
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it("should remove toast after timeout", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Test toast" });
    });

    expect(result.current.toasts).toHaveLength(1);

    act(() => {
      result.current.dismiss(result.current.toasts[0].id);
    });

    // Fast-forward time past TOAST_REMOVE_DELAY
    act(() => {
      vi.advanceTimersByTime(TOAST_REMOVE_DELAY + 1);
    });

    expect(result.current.toasts).toHaveLength(0);
  });

  it("should update a toast", () => {
    const { result } = renderHook(() => useToast());

    let updateFn: (props: any) => void;
    act(() => {
      const { update } = result.current.toast({ title: "Original" });
      updateFn = update;
    });

    act(() => {
      updateFn({ title: "Updated" });
    });

    expect(result.current.toasts[0].title).toBe("Updated");
  });

  it("should not add duplicate listeners on re-render", () => {
    const { result, rerender } = renderHook(() => useToast());

    // Add initial toast
    act(() => {
      result.current.toast({ title: "Test 1" });
    });

    expect(result.current.toasts).toHaveLength(1);

    // Force multiple re-renders
    rerender();
    rerender();
    rerender();

    // Add another toast (will replace first due to TOAST_LIMIT)
    act(() => {
      result.current.toast({ title: "Test 2" });
    });

    // Should still only have 1 toast, and state should be consistent
    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].title).toBe("Test 2");
  });

  it("should cleanup listener on unmount", () => {
    const { result, unmount } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Test" });
    });

    expect(result.current.toasts).toHaveLength(1);

    unmount();

    // Create a new hook instance
    const { result: result2 } = renderHook(() => useToast());

    // Should still have the toast in memory state
    expect(result2.current.toasts).toHaveLength(1);
  });

  it("should call onOpenChange when dismissing", () => {
    const { result } = renderHook(() => useToast());

    let toastId: string;
    act(() => {
      const { id } = result.current.toast({ title: "Test" });
      toastId = id;
    });

    // Simulate Radix UI calling onOpenChange(false)
    act(() => {
      result.current.toasts[0].onOpenChange?.(false);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it("should handle timeout cleanup correctly", () => {
    const { result } = renderHook(() => useToast());

    act(() => {
      result.current.toast({ title: "Test" });
    });

    const toastId = result.current.toasts[0].id;

    // Dismiss the toast
    act(() => {
      result.current.dismiss(toastId);
    });

    // Try dismissing again - should not create duplicate timeout
    act(() => {
      result.current.dismiss(toastId);
    });

    // Advance time past TOAST_REMOVE_DELAY
    act(() => {
      vi.advanceTimersByTime(TOAST_REMOVE_DELAY + 1);
    });

    // Should only be removed once
    expect(result.current.toasts).toHaveLength(0);
  });

  it("should generate unique IDs for toasts", () => {
    const { result } = renderHook(() => useToast());

    let id1: string = "";
    let id2: string = "";
    act(() => {
      const toast1 = result.current.toast({ title: "Toast 1" });
      const toast2 = result.current.toast({ title: "Toast 2" });
      id1 = toast1.id;
      id2 = toast2.id;
    });

    expect(id1).not.toBe(id2);
  });
});

describe("toast function", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    resetToastState();
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("should return dismiss and update functions", () => {
    const result = toast({ title: "Test" });

    expect(result).toHaveProperty("id");
    expect(result).toHaveProperty("dismiss");
    expect(result).toHaveProperty("update");
    expect(typeof result.dismiss).toBe("function");
    expect(typeof result.update).toBe("function");
  });
});
