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
});
