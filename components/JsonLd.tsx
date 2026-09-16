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
 */
const JsonLd = ({ data }: JsonLdProps) => {
  const items = Array.isArray(data) ? data : [data];

  return (
    <>
      {items.map((item) => (
        <script
          key={JSON.stringify(item)}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
};

export default JsonLd;
