import { cn } from "@/utils/classnames";

describe("cn utility function", () => {
  it("should handle string inputs", () => {
    expect(cn("text-red-500", "bg-blue-100")).toBe("text-red-500 bg-blue-100");
  });

  it("should handle undefined and null inputs", () => {
    expect(cn("text-red-500", undefined, "bg-blue-100", null)).toBe("text-red-500 bg-blue-100");
  });

  it("should handle boolean conditional classes", () => {
    const isActive = true;
    const isHidden = false;
    expect(cn("text-red-500", isActive && "bg-blue-100", isHidden && "hidden")).toBe("text-red-500 bg-blue-100");
  });

  it("should handle object inputs with boolean values", () => {
    expect(
      cn({
        "text-red-500": true,
        "bg-blue-100": false,
        "font-bold": true,
      })
    ).toBe("text-red-500 font-bold");
  });

  it("should handle array inputs", () => {
    expect(cn(["text-red-500", "bg-blue-100"])).toBe("text-red-500 bg-blue-100");
  });

  it("should handle mixed input types", () => {
    expect(
      cn(
        "text-red-500",
        ["bg-blue-100", "font-bold"],
        {
          "border-2": true,
          hidden: false,
        },
        undefined,
        "p-4"
      )
    ).toBe("text-red-500 bg-blue-100 font-bold border-2 p-4");
  });

  it("should merge conflicting Tailwind classes", () => {
    // tailwind-merge should resolve conflicts by keeping the last one
    expect(cn("text-red-500", "text-blue-500")).toBe("text-blue-500");
    expect(cn("p-4", "p-8")).toBe("p-8");
    expect(cn("bg-red-100", "bg-blue-200")).toBe("bg-blue-200");
  });

  it("should handle responsive variants correctly", () => {
    expect(cn("text-sm", "md:text-lg", "lg:text-xl")).toBe("text-sm md:text-lg lg:text-xl");
  });

  it("should handle hover and focus variants", () => {
    expect(cn("text-black", "hover:text-red-500", "focus:text-blue-500")).toBe(
      "text-black hover:text-red-500 focus:text-blue-500"
    );
  });

  it("should merge conflicting classes with variants", () => {
    expect(cn("text-red-500", "hover:text-red-600", "text-blue-500")).toBe("hover:text-red-600 text-blue-500");
  });

  it("should handle empty inputs", () => {
    expect(cn()).toBe("");
    expect(cn("")).toBe("");
    expect(cn(null, undefined, false)).toBe("");
  });

  it("should handle spacing classes correctly", () => {
    expect(cn("m-2", "mx-4")).toBe("m-2 mx-4");
    expect(cn("p-2", "px-4", "py-6")).toBe("p-2 px-4 py-6");
  });

  it("should handle complex Tailwind merge scenarios", () => {
    // Test complex merging with multiple conflicting classes
    expect(cn("bg-red-500 text-white p-4 rounded-lg", "bg-blue-500 text-black rounded-xl")).toBe(
      "p-4 bg-blue-500 text-black rounded-xl"
    );
  });

  it("should preserve non-Tailwind classes", () => {
    expect(cn("custom-class", "text-red-500", "another-custom")).toBe("custom-class text-red-500 another-custom");
  });

  it("should handle dark mode variants", () => {
    expect(cn("text-black", "dark:text-white", "bg-white", "dark:bg-black")).toBe(
      "text-black dark:text-white bg-white dark:bg-black"
    );
  });

  it("should handle arbitrary values", () => {
    expect(cn("text-[14px]", "bg-[#ff0000]")).toBe("text-[14px] bg-[#ff0000]");
  });

  it("should merge arbitrary values correctly", () => {
    expect(cn("text-[14px]", "text-[16px]")).toBe("text-[16px]");
  });
});
