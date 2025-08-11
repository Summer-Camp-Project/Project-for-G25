import { Loader2, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

export function LoadMoreButton({ onClick, isLoading, hasMore }) {
  if (!hasMore) {
    return null;
  }

  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      variant="outline"
      size="lg"
      className="border-gray-200 text-gray-700 hover:bg-gray-50 transition-all duration-200"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Loading more artifacts...
        </>
      ) : (
        <>
          <ChevronDown className="w-4 h-4 mr-2" />
          Load More Artifacts
        </>
      )}
    </Button>
  );
}
