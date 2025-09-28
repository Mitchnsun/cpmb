import { truncateAtWord } from "@/utils/truncate";

describe("truncateAtWord", () => {
  it("should return original when below limit", () => {
    const txt = "Bonjour le monde";
    expect(truncateAtWord(txt, 100)).toBe(txt);
  });

  it("should cut at the next space after limit and adds ellipsis", () => {
    const txt = "Le Choeur des Pays du Mont Blanc donnera un concert exceptionnel au printemps prochain";
    // limit within the word "exceptionnel", next space is after that word
    const result = truncateAtWord(txt, 60);
    expect(result).toBe("Le Choeur des Pays du Mont Blanc donnera un concert exceptionnel...");
  });

  it("should fall back to previous space when no space after limit", () => {
    const txt = "Un texte court sans espaceapreslimite"; // no space after 'limite' boundary
    const result = truncateAtWord(txt, 20);
    expect(result).toBe("Un texte court sans...");
  });

  it("should hard cut a single long word when no spaces present", () => {
    const txt = "supercalifragilisticexpialidocious";
    const result = truncateAtWord(txt, 10);
    expect(result).toBe("supercalif...");
  });

  it("should normalize newlines and multiple spaces", () => {
    const txt = "Le Choeur\n\n des   Pays\tdu Mont\nBlanc";
    const result = truncateAtWord(txt, 15);
    // normalized to single spaces, then cut at the next space after 15 (not in the middle of "Pays")
    expect(result).toBe("Le Choeur des Pays...");
  });
});
