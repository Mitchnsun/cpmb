import { render } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";

import JsonLd from "@/components/JsonLd";

const blocksOf = (container: HTMLElement) =>
  [...container.querySelectorAll('script[type="application/ld+json"]')].map((node) =>
    JSON.parse(node.textContent ?? "{}")
  );

describe("JsonLd", () => {
  it("should render a single object as one script", () => {
    const { container } = render(<JsonLd data={{ "@type": "Thing", name: "Un objet" }} />);

    expect(blocksOf(container)).toEqual([{ "@type": "Thing", name: "Un objet" }]);
  });

  it("should render an array as one script per item, in order", () => {
    const data = [
      { "@type": "Thing", name: "Premier" },
      { "@type": "Thing", name: "Second" },
    ];

    const { container } = render(<JsonLd data={data} />);

    expect(blocksOf(container)).toEqual(data);
  });

  it("should not let a closing script tag in the content break out of the block", () => {
    /*
     * Asserted on the served markup, not on a DOM built in memory: the pages
     * are prerendered, and the danger is a browser's HTML parser ending the
     * element at the first `</script>` it reads. Assigning the same string
     * through `innerHTML`, as a test renderer does, never re-parses it and
     * would pass either way.
     */
    const data = { "@type": "Thing", name: 'Concert </script><img src="x" onerror="alert(1)">' };

    const markup = renderToStaticMarkup(<JsonLd data={data} />);

    expect(markup.match(/<\/script>/g)).toHaveLength(1);
    expect(markup).not.toContain("<img");
    expect(JSON.parse(markup.replace(/^<script[^>]*>|<\/script>$/g, ""))).toEqual(data);
  });

  it("should render nothing for an empty array", () => {
    const { container } = render(<JsonLd data={[]} />);

    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });
});
