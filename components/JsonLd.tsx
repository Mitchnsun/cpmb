import { jsonLdText } from "@/utils/jsonLd";

interface JsonLdProps {
  /** One schema.org object, or several — a concert with two performances
      publishes one `MusicEvent` each. */
  data: object | readonly object[];
}

/**
 * Renders one or more schema.org blocks (CPMB-18). Read by crawlers only —
 * nothing of it reaches the screen or a screen reader — so the single
 * `dangerouslySetInnerHTML` this takes lives here, not repeated on every
 * page that has structured data to publish.
 *
 * That single call is also why the serialisation goes through `jsonLdText`:
 * content comes from files the bureau edits, and a `</script>` written in a
 * concert title would otherwise end the element early and leave the rest of
 * the block to the HTML parser.
 */
const JsonLd = ({ data }: JsonLdProps) => {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item) => (
        <script
          key={JSON.stringify(item)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdText(item) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
