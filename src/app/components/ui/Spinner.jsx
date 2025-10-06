import React from "react";
import { LoaderIcon } from "lucide-react";
import clsx from "clsx"; // equivalent of your 'cn' utility

// Spinner component
function Spinner({ className, ...props }) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={clsx("w-4 h-4 animate-spin", className)}
      {...props}
    />
  );
}

// Custom wrapper to display the spinner
export function SpinnerCustom() {
  return (
    <div className="flex items-center gap-4">
      <Spinner />
    </div>
  );
}

export default Spinner;
