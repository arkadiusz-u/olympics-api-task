import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Search } from "lucide-react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Filters } from "@/lib/parseFilters";

interface SearchBarProps {
  search: Filters['search'];
  gender: Filters['gender'];
  sortOrder: Filters['sortOrder'];
  setFilter: (updates: Partial<Filters>) => void;
  setSearchTerm: (search: string) => void;
}

const GENDER_FILTERS = {
  all: "All tournaments",
  Men: "Men",
  Women: "Women",
};

const SORT_ORDER_FILTERS = {
  asc: "Oldest first",
  desc: "Newest first",
};

export const SearchBar = ({
  search,
  gender,
  sortOrder,
  setFilter,
  setSearchTerm,
}: SearchBarProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Search and filters</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              defaultValue={search}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search team or venue"
              className="pl-8"
            />
          </div>
          <Select value={gender} onValueChange={(value) => setFilter({ gender: value as Filters["gender"] })}>
            <SelectTrigger className="w-full lg:w-36">
              <SelectValue placeholder="Tournament" />
            </SelectTrigger>
            <SelectContent>
              {
              Object.entries(GENDER_FILTERS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortOrder} onValueChange={(value) => setFilter({ sortOrder: value as Filters["sortOrder"] })}>
            <SelectTrigger className="w-full lg:w-40">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORT_ORDER_FILTERS).map(([key, value]) => (
                <SelectItem key={key} value={key}>{value}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
