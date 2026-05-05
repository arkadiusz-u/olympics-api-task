import { Filters } from "@/lib/parseFilters";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { useDebouncedCallback } from "use-debounce";

const buildFilterParams = (searchParams: URLSearchParams, updates: Partial<Filters>) => {
  Object.entries(updates).forEach(([key, value]) => {
    const filterKey = key as keyof Filters;
    const nextValue = value?.toString() ?? "";

    if (filterKey === "search" && !nextValue) {
      searchParams.delete(filterKey);
      return;
    }

    searchParams.set(filterKey, nextValue);
  });

  return searchParams;
};

export const useFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const routeWithFilters = useCallback((updates: Partial<Filters>) => {
    const params = buildFilterParams(new URLSearchParams(searchParams ?? undefined), updates);
    const queryString = params.toString();
  
    startTransition(() => {
      router.push(`/?${queryString}`);
    });
  }, [router, searchParams]);

  const setFilter = useCallback((updates: Partial<Filters>) => {
    routeWithFilters(updates);
  }, [routeWithFilters]);

  const setSearchTerm = useDebouncedCallback((search: string) => {
    routeWithFilters({ search });
  }, 300);

  return { isPending, setFilter, setSearchTerm } as const;
}