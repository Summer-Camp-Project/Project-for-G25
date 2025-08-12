"use client";

import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";

import { cn } from "./utils";

function Label({ className, ...props }) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        // Basic label styling: flex layout, gap, font size, weight, and no text selection
        "flex items-center gap-2 text-sm leading-none font-medium select-none " +
        // When the parent group has disabled state, make pointer-events none and reduce opacity
        "group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 " +
        // When the peer input is disabled, change cursor and opacity
        "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export { Label };
