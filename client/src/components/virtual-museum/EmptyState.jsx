import { Search, Filter, Package } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

export function EmptyState({ onClearFilters, hasActiveFilters }) {
  return (
    <Card className="border-gray-200 bg-white">
      <CardContent className="p-12 text-center">
        <div className="max-w-md mx-auto">
          {hasActiveFilters ? (
            <>
              <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No artifacts match your filters
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or filters to find more artifacts.
              </p>
              <Button
                onClick={onClearFilters}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Clear All Filters
              </Button>
            </>
          ) : (
            <>
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No artifacts found
              </h3>
              <p className="text-gray-600 mb-6">
                We couldn't find any artifacts matching your search. Try a different search term.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  variant="outline"
                  className="border-gray-200 text-gray-700 hover:bg-gray-50"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Browse All Artifacts
                </Button>
                <Button
                  onClick={onClearFilters}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Reset Search
                </Button>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
