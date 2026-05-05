import { MatchViewModel } from "@/types";
import { Filters } from "./parseFilters";

const filters = {
    search: (item: MatchViewModel, value: string) => [item.homeTeam, item.awayTeam, item.venueLabel].some((field) => field.toLowerCase().includes(value.toLowerCase())),
    gender: (item: MatchViewModel, value: string) => value === "all" || item.genderLabel === value,
};

export const filter = (data: MatchViewModel[], searchParams: Filters) => {
    return data.filter(item => {
        return Object.entries(searchParams).every(([key, value]) => {
            if (!filters[key as keyof typeof filters] || !value) return true;
            return filters[key as keyof typeof filters](item, value);
        });
    });
};
