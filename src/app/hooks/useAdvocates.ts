import { useInfiniteQuery } from "@tanstack/react-query";

export const useAdvocates = () => {
  const fetchAdvocates = async ({ pageParam = 0 }) => {
    const limit = 20;
    const res = await fetch(
      `/api/advocates?limit=${limit}&offset=${pageParam}`
    );
    const json = await res.json();
    return {
      data: json.data,
      nextOffset: json.data.length === limit ? pageParam + limit : undefined,
    };
  };

  return useInfiniteQuery({
    queryKey: ["advocates"],
    queryFn: fetchAdvocates,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
    initialPageParam: 0,
  });
};
