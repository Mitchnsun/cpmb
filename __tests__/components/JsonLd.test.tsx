import { render } from "@testing-library/react";

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

  it("should render nothing for an empty array", () => {
    const { container } = render(<JsonLd data={[]} />);

    expect(container.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });
});
