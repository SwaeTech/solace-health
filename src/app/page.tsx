"use client";

import { useState, useRef, useEffect } from "react";
import { AdvocateCard } from "./components/AdvocateCard";
import { useAdvocates } from "./hooks/useAdvocates";

type Advocate = {
  firstName: string;
  lastName: string;
  city: string;
  degree: string;
  specialties: Specialties[];
  focusAreas: FocusAreas[];
  yearsOfExperience: string;
  phoneNumber: string;
};

type Specialties = {
  id: number | null;
  name: string;
};

type FocusAreas = {
  id: number | null;
  name: string;
};

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useAdvocates();
  const sentinelRef = useRef<HTMLDivElement>(null);

  // Flatten paginated data
  const advocates = data?.pages.flatMap((page) => page.data) ?? [];

  // Filter advocates by search term
  const filteredAdvocates = advocates.filter((advocate) => {
    const value = searchTerm.toLowerCase();
    return (
      advocate.firstName.toLowerCase().includes(value) ||
      advocate.lastName.toLowerCase().includes(value) ||
      advocate.city.toLowerCase().includes(value) ||
      advocate.degree.toLowerCase().includes(value) ||
      advocate.specialties.some((s: { name: string }) =>
        s.name.toLowerCase().includes(value)
      ) ||
      advocate.yearsOfExperience.toString().includes(value)
    );
  });

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
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

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
        {filteredAdvocates.map((advocate) => (
          <AdvocateCard
            key={advocate.firstName + advocate.lastName + advocate.phoneNumber}
            advocate={advocate}
          />
        ))}
        {hasNextPage && (
          <div ref={sentinelRef} className="h-8">
            Sentinel
          </div>
        )}
        {isFetchingNextPage && <div>Loading...</div>}
      </div>
    </main>
  );
}
