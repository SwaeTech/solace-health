"use client";

import { useEffect, useState } from "react";
import { AdvocateCard } from "../components/AdvocateCard";

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
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    const filtered = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(value) ||
        advocate.lastName.includes(value) ||
        advocate.city.includes(value) ||
        advocate.degree.includes(value) ||
        advocate.specialties.some((s) => s.name.includes(value)) ||
        advocate.yearsOfExperience.toString().includes(value)
      );
    });

    setFilteredAdvocates(filtered);
  };

  const onClick = () => {
    setSearchTerm("");
    setFilteredAdvocates(advocates);
  };

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
      </div>
    </main>
  );
}
