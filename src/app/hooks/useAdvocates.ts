import { useInfiniteQuery } from "@tanstack/react-query";

export const useAdvocates = (q: string, limit = 20) =>
  useInfiniteQuery({
    queryKey: ["advocates", q, limit],
    queryFn: async ({ pageParam = 0 }) => {
      const url = `/api/advocates?limit=${limit}&offset=${pageParam}&q=${encodeURIComponent(
        q
      )}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch advocates");
      const json = await res.json();
      return {
        data: json.data,
        nextOffset: json.nextOffset ?? undefined,
        total: json.total ?? 0,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });
