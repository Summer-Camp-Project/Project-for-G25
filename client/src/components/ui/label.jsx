// Label.jsx
"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // The 'group-data-[disabled=true]' class has been removed
        // as it is not a standard Tailwind utility and likely requires a custom plugin.
        // The 'peer-disabled' classes are standard and remain.
        "flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
  
}

export { Label };
