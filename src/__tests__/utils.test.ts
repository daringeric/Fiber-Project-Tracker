import {
  cn,
  formatDate,
  formatDateTime,
  getRelativeTime,
  titleCase,
  truncate,
  formatAddress,
  formatPhone,
  generateId,
  isEmpty,
  debounce,
} from "@/lib/utils";

describe("cn (className utility)", () => {
  it("combines multiple class names", () => {
    expect(cn("class1", "class2")).toBe("class1 class2");
  });

  it("handles conditional classes", () => {
    expect(cn("base", true && "included", false && "excluded")).toBe(
      "base included"
    );
  });

  it("merges tailwind classes correctly", () => {
    expect(cn("px-2 py-1", "px-4")).toBe("py-1 px-4");
  });
});

describe("formatDate", () => {
  it("formats date string to readable format", () => {
    const date = "2024-03-15T10:30:00Z";
    const result = formatDate(date);
    expect(result).toMatch(/Mar 15, 2024/);
  });

  it("formats Date object to readable format", () => {
    const date = new Date("2024-06-20");
    const result = formatDate(date);
    expect(result).toMatch(/Jun 20, 2024/);
  });

  it("accepts custom options", () => {
    const date = "2024-03-15";
    const result = formatDate(date, { month: "long" });
    expect(result).toMatch(/March/);
  });
});

describe("formatDateTime", () => {
  it("includes time in the formatted output", () => {
    const date = new Date("2024-03-15T14:30:00");
    const result = formatDateTime(date);
    expect(result).toMatch(/Mar 15, 2024/);
    expect(result).toMatch(/2:30/);
  });
});

describe("getRelativeTime", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-03-15T12:00:00Z"));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("returns 'just now' for recent times", () => {
    const date = new Date("2024-03-15T11:59:30Z");
    expect(getRelativeTime(date)).toBe("just now");
  });

  it("returns minutes ago", () => {
    const date = new Date("2024-03-15T11:55:00Z");
    expect(getRelativeTime(date)).toBe("5 minutes ago");
  });

  it("returns singular minute", () => {
    const date = new Date("2024-03-15T11:59:00Z");
    expect(getRelativeTime(date)).toBe("1 minute ago");
  });

  it("returns hours ago", () => {
    const date = new Date("2024-03-15T09:00:00Z");
    expect(getRelativeTime(date)).toBe("3 hours ago");
  });

  it("returns days ago", () => {
    const date = new Date("2024-03-13T12:00:00Z");
    expect(getRelativeTime(date)).toBe("2 days ago");
  });

  it("returns weeks ago", () => {
    const date = new Date("2024-03-01T12:00:00Z");
    expect(getRelativeTime(date)).toBe("2 weeks ago");
  });
});

describe("titleCase", () => {
  it("capitalizes first letter of each word", () => {
    expect(titleCase("hello world")).toBe("Hello World");
  });

  it("handles mixed case input", () => {
    expect(titleCase("hELLO wORLD")).toBe("Hello World");
  });

  it("handles single word", () => {
    expect(titleCase("hello")).toBe("Hello");
  });
});

describe("truncate", () => {
  it("truncates long strings with ellipsis", () => {
    expect(truncate("This is a long string", 10)).toBe("This is...");
  });

  it("returns original string if shorter than max length", () => {
    expect(truncate("Short", 10)).toBe("Short");
  });

  it("handles exact length strings", () => {
    expect(truncate("12345", 5)).toBe("12345");
  });
});

describe("formatAddress", () => {
  it("formats complete address", () => {
    const address = {
      street: "123 Main St",
      city: "Springfield",
      state: "IL",
      zipCode: "62701",
    };
    expect(formatAddress(address)).toBe("123 Main St\nSpringfield, IL 62701");
  });

  it("includes unit when provided", () => {
    const address = {
      street: "456 Oak Ave",
      unit: "Apt 2B",
      city: "Chicago",
      state: "IL",
      zipCode: "60601",
    };
    expect(formatAddress(address)).toBe(
      "456 Oak Ave, Apt 2B\nChicago, IL 60601"
    );
  });
});

describe("formatPhone", () => {
  it("formats 10-digit phone number", () => {
    expect(formatPhone("5551234567")).toBe("(555) 123-4567");
  });

  it("formats phone with existing formatting", () => {
    expect(formatPhone("555-123-4567")).toBe("(555) 123-4567");
  });

  it("returns original if not 10 digits", () => {
    expect(formatPhone("12345")).toBe("12345");
  });
});

describe("generateId", () => {
  it("generates unique IDs", () => {
    const id1 = generateId();
    const id2 = generateId();
    expect(id1).not.toBe(id2);
  });

  it("generates strings of appropriate length", () => {
    const id = generateId();
    expect(id.length).toBeGreaterThan(0);
    expect(id.length).toBeLessThanOrEqual(7);
  });
});

describe("isEmpty", () => {
  it("returns true for null", () => {
    expect(isEmpty(null)).toBe(true);
  });

  it("returns true for undefined", () => {
    expect(isEmpty(undefined)).toBe(true);
  });

  it("returns true for empty string", () => {
    expect(isEmpty("")).toBe(true);
    expect(isEmpty("   ")).toBe(true);
  });

  it("returns true for empty array", () => {
    expect(isEmpty([])).toBe(true);
  });

  it("returns true for empty object", () => {
    expect(isEmpty({})).toBe(true);
  });

  it("returns false for non-empty values", () => {
    expect(isEmpty("hello")).toBe(false);
    expect(isEmpty([1, 2])).toBe(false);
    expect(isEmpty({ key: "value" })).toBe(false);
    expect(isEmpty(0)).toBe(false);
  });
});

describe("debounce", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("delays function execution", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    expect(fn).not.toHaveBeenCalled();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("only executes once for rapid calls", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn();
    debouncedFn();
    debouncedFn();

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("passes arguments to the debounced function", () => {
    const fn = jest.fn();
    const debouncedFn = debounce(fn, 100);

    debouncedFn("arg1", "arg2");

    jest.advanceTimersByTime(100);
    expect(fn).toHaveBeenCalledWith("arg1", "arg2");
  });
});
