import { formatFrenchDateTime } from "@/utils/formatDate";

describe("formatFrenchDateTime", () => {
  it("formats a winter date (CET) correctly", () => {
    const iso = "2024-12-13T20:00:00+01:00";
    expect(formatFrenchDateTime(iso)).toBe("13 décembre 2024 à 20h00");
  });

  it("formats a summer date (CEST) correctly", () => {
    const iso = "2024-06-15T20:30:00+02:00";
    expect(formatFrenchDateTime(iso)).toBe("15 juin 2024 à 20h30");
  });

  it("removes leading zero from hours", () => {
    const iso = "2024-11-05T08:05:00+01:00";
    expect(formatFrenchDateTime(iso)).toBe("5 novembre 2024 à 8h05");
  });

  it("returns empty string for invalid input", () => {
    expect(formatFrenchDateTime("not-a-date")).toBe("");
    expect(formatFrenchDateTime("")).toBe("");
  });
});
