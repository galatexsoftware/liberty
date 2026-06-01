import { describe, expect, it } from "vitest";
import { clamp, cn, formatKsh } from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
    expect(cn("text-navy", false && "hidden", "font-bold")).toBe("text-navy font-bold");
  });
});

describe("clamp", () => {
  it("constrains a value to the given range", () => {
    expect(clamp(5, 0, 10)).toBe(5);
    expect(clamp(-3, 0, 10)).toBe(0);
    expect(clamp(42, 0, 10)).toBe(10);
  });
});

describe("formatKsh", () => {
  it("formats numbers as Kenyan Shillings with no decimals", () => {
    const formatted = formatKsh(150000);
    expect(formatted).toContain("150,000");
  });
});
