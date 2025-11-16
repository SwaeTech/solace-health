"use client";

import { useState, useRef, useEffect } from "react";
import { AdvocateCard } from "./components/AdvocateCard";
import { useAdvocates } from "./hooks/useAdvocates";

// Simple debounce helper
function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedQ = useDebouncedValue(searchTerm, 300);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAdvocates(debouncedQ);

  const sentinelRef = useRef<HTMLDivElement>(null);

  // Flatten paginated data (server already filters by q)
  const advocates = data?.pages.flatMap((page) => page.data) ?? [];

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const onClick = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (!sentinelRef.current || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0 }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, data?.pages?.length]);

  return (
    <main className="m-6">
      <h1 className="text-2xl font-bold">Solace Advocates</h1>
      <div className="my-6">
        <input
          className="border border-black px-2 py-1 rounded w-80"
          value={searchTerm}
          onChange={onChange}
          placeholder="search for your advocate"
        />
        <button
          className="ml-2 px-3 py-1 border rounded bg-gray-100 hover:bg-gray-200"
          onClick={onClick}
        >
          Reset Search
        </button>
      </div>
      <div className="flex flex-col gap-6 w-full">
        {advocates.map((advocate: any) => (
          <AdvocateCard
            key={
              (advocate.advocateId ?? "") +
              advocate.firstName +
              advocate.lastName +
              advocate.phoneNumber
            }
            advocate={advocate}
          />
        ))}
        {hasNextPage && (
          <div ref={sentinelRef} className="h-8" />
        )}
        {isFetchingNextPage && <div>Loading...</div>}
        {isLoading && advocates.length === 0 && <div>Loading...</div>}
        {!isLoading && advocates.length === 0 && (
          <div>No advocates found.</div>
        )}
      </div>
    </main>
  );
}
