import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-all outline-none focus-visible:outline-primary focus-visible:outline-2 focus-visible:outline-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        /** Ana eylem — neon turkuaz, koyu metin (11.2:1 kontrast). */
        primary:
          "bg-primary text-primary-foreground hover:shadow-glow-lg hover:brightness-110 active:brightness-95",
        /** İkincil — cam yüzey, turkuaz kenarlıkla vurgu. */
        outline:
          "border border-input bg-surface/40 text-foreground backdrop-blur-sm hover:border-primary hover:bg-surface hover:text-primary",
        ghost: "text-muted-foreground hover:bg-accent hover:text-foreground",
        ocean: "bg-ocean text-ocean-foreground hover:brightness-110 active:brightness-95",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type ButtonProps = ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    /** true ise kendi <button> etiketini üretmez, çocuğuna stil verir (Link ile kullanım). */
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
