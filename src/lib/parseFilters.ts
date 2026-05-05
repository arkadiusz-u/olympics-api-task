import { SearchParams } from "next/dist/server/request/search-params";
import { z } from "zod";

export const filterSchema = z.object({
  search: z.string().optional().default(""),
  gender: z.enum(["all", "Men", "Women"]).optional().catch("all"),
  sortOrder: z.enum(["asc", "desc"]).optional().catch("asc"),
});

export type Filters = z.infer<typeof filterSchema>;

export const parseFilters = (searchParams: SearchParams): Filters => {
    const result = filterSchema.safeParse(searchParams);
    return result.success ? result.data : filterSchema.parse({});
};
