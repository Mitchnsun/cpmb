import { formatFrenchDateTime } from "@/utils/formatDate";

describe("formatFrenchDateTime", () => {
  it("should format a winter date (CET) correctly", () => {
    const iso = "2024-12-13T20:00:00+01:00";
    expect(formatFrenchDateTime(iso)).toBe("13 décembre 2024 à 20h00");
  });

  it("should format a summer date (CEST) correctly", () => {
    const iso = "2024-06-15T20:30:00+02:00";
    expect(formatFrenchDateTime(iso)).toBe("15 juin 2024 à 20h30");
  });

  it("should remove leading zero from hours", () => {
    const iso = "2024-11-05T08:05:00+01:00";
    expect(formatFrenchDateTime(iso)).toBe("5 novembre 2024 à 8h05");
  });

  it("should format date-only string without time", () => {
    const iso = "2024-12-13";
    expect(formatFrenchDateTime(iso)).toBe("13 décembre 2024");
  });

  it("should format another date-only string correctly", () => {
    const iso = "2022-10-16";
    expect(formatFrenchDateTime(iso)).toBe("16 octobre 2022");
  });

  it("should return empty string for invalid input", () => {
    expect(formatFrenchDateTime("not-a-date")).toBe("");
    expect(formatFrenchDateTime("")).toBe("");
  });

  it("should use custom timezone when provided", () => {
    const iso = "2024-12-13T20:00:00+01:00";
    const result = formatFrenchDateTime(iso, { timeZone: "America/New_York" });
    // The result should be different from Europe/Paris timezone
    expect(result).toBe("13 décembre 2024 à 14h00"); // 6 hours difference from CET
  });

  it("should handle edge case with missing format parts gracefully", () => {
    // Test a date that should work normally to ensure parts are found
    const iso = "2024-01-01T12:00:00+01:00";
    const result = formatFrenchDateTime(iso);
    expect(result).toBe("1 janvier 2024 à 12h00");
  });

  it("should format minutes correctly with leading zeros", () => {
    const iso = "2024-12-13T09:05:00+01:00";
    expect(formatFrenchDateTime(iso)).toBe("13 décembre 2024 à 9h05");
  });

  it("should handle date-only strings in different formats", () => {
    // ISO date without time
    expect(formatFrenchDateTime("2024-07-14")).toBe("14 juillet 2024");

    // Another date format test
    expect(formatFrenchDateTime("2023-02-28")).toBe("28 février 2023");
  });
});
