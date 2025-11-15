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

  useEffect(() => {
    console.log("fetching advocates...");
    fetch("/api/advocates").then((response) => {
      response.json().then((jsonResponse) => {
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      });
    });
  }, []);

  const onChange = (e: { target: { value: any } }) => {
    const searchTerm = e.target.value;

    // TODO: handle antipattern direct DOM manipulation
    const searchTermElement = document.getElementById("search-term");
    if (searchTermElement) {
      searchTermElement.innerHTML = searchTerm;
    }

    console.log("filtering advocates...");
    const filteredAdvocates = advocates.filter((advocate) => {
      return (
        advocate.firstName.includes(searchTerm) ||
        advocate.lastName.includes(searchTerm) ||
        advocate.city.includes(searchTerm) ||
        advocate.degree.includes(searchTerm) ||
        advocate.specialties.includes(searchTerm) ||
        advocate.yearsOfExperience.includes(searchTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main className="m-6">
      <h1 className="text-2xl font-bold">Solace Advocates</h1>
      <div className="my-6">
        <p>Search</p>
        <p>
          Searching for: <span id="search-term"></span>
        </p>
        <input
          className="border border-black px-2 py-1 rounded"
          onChange={onChange}
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
          <AdvocateCard key={advocate.firstName + advocate.lastName + advocate.phoneNumber} advocate={advocate} />
        ))}
      </div>
    </main>
  );
}
