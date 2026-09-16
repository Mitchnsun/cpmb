/**
 * A schema.org object, serialised for a `<script type="application/ld+json">`.
 *
 * `JSON.stringify` alone is not safe there. The HTML parser ends the element
 * at the first `</script>` it meets, wherever it sits — inside a JSON string
 * included — and reads whatever follows as markup. A concert title or a
 * press excerpt carrying that sequence would close the block early and hand
 * the rest of the data to the parser as HTML.
 *
 * So `<`, `>` and `&` are written as escapes. Every JSON reader decodes them
 * back to the same characters, which is why the crawler sees the data
 * unchanged, and the two line separators that are valid in JSON but not in
 * JavaScript go with them.
 */
export const jsonLdText = (data: unknown): string =>
  JSON.stringify(data)
    .replaceAll("<", "\\u003c")
    .replaceAll(">", "\\u003e")
    .replaceAll("&", "\\u0026")
    .replaceAll(" ", "\\u2028")
    .replaceAll(" ", "\\u2029");

export default jsonLdText;
