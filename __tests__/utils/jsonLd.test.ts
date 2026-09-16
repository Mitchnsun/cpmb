import { jsonLdText } from "@/utils/jsonLd";

describe("jsonLdText", () => {
  it("should never let a closing script tag through", () => {
    const text = jsonLdText({ name: "Concert </script><img src=x onerror=alert(1)>" });

    expect(text).not.toContain("</script>");
    expect(text).not.toContain("<");
    expect(text).toContain("\\u003c/script\\u003e");
  });

  it("should escape what an HTML parser reads, and nothing else", () => {
    expect(jsonLdText({ a: "<", b: ">", c: "&" })).toBe('{"a":"\\u003c","b":"\\u003e","c":"\\u0026"}');
  });

  it("should escape the separators JavaScript refuses inside a string", () => {
    expect(jsonLdText({ a: "\u2028\u2029" })).toBe('{"a":"\\u2028\\u2029"}');
  });

  it("should hand a crawler back exactly the data it was given", () => {
    const data = {
      "@type": "MusicEvent",
      name: "Concert </script> & « Misa Criolla » — 7 juin",
      location: { "@type": "Place", name: "Vongy, France" },
    };

    expect(JSON.parse(jsonLdText(data))).toEqual(data);
  });
});
