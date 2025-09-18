import { cva, type VariantProps } from "class-variance-authority";
import { HTMLAttributes, PropsWithChildren } from "react";

import { cn } from "@/utils/classnames";

const headingVariants = cva("font-bold tracking-tight", {
  variants: {
    variant: {
      0: "",
      1: "text-xl text-sky-700",
      2: "font-noto text-lg text-gray-800",
      3: "text-lg",
    },
  },
  defaultVariants: {
    variant: 1,
  },
});

interface HeadingProps
  extends PropsWithChildren,
    VariantProps<typeof headingVariants>,
    HTMLAttributes<HTMLHeadingElement> {
  hLevel?: 1 | 2 | 3 | 4 | 5 | 6;
}

const Heading = ({ className, hLevel, variant, children, ...htmlProps }: HeadingProps) => {
  const headingLevel = hLevel ?? variant ?? 1;
  const headingProps = {
    className: cn(headingVariants({ variant }), className),
    ...htmlProps,
  };

  switch (headingLevel) {
    case 1:
      return <h1 {...headingProps}>{children}</h1>;
    case 2:
      return <h2 {...headingProps}>{children}</h2>;
    case 3:
      return <h3 {...headingProps}>{children}</h3>;
    case 4:
      return <h4 {...headingProps}>{children}</h4>;
    case 5:
      return <h5 {...headingProps}>{children}</h5>;
    case 6:
      return <h6 {...headingProps}>{children}</h6>;
    default:
      return <h1 {...headingProps}>{children}</h1>;
  }
};

export default Heading;
