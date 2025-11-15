"use client";

import { useEffect, useState } from "react";

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
          <div
            key={advocate.firstName + advocate.lastName + advocate.phoneNumber}
            className="flex flex-row items-center border border-gray-300 rounded-lg p-6 w-full shadow-md bg-gradient-to-r from-accentMid/20 via-white to-white"
          >
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-2">
                {advocate.firstName} {advocate.lastName}
              </h2>
              <p>
                <span className="font-semibold">City:</span> {advocate.city}
              </p>
              <p>
                <span className="font-semibold">Degree:</span> {advocate.degree}
              </p>
              <p>
                <span className="font-semibold">Years of Experience:</span>{" "}
                {advocate.yearsOfExperience}
              </p>
              <p>
                <span className="font-semibold">Phone Number:</span>{" "}
                {advocate.phoneNumber}
              </p>
            </div>
            <div className="flex-1">
              <div className="mb-2">
                <span className="font-semibold">Specialties:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {advocate.specialties.map((s) => (
                    <span
                      key={s.id}
                      className="px-3 py-1 bg-accentGoldLight rounded-full text-neutralBlack text-sm font-medium"
                    >
                      {s.name}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-semibold">Focus Areas:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {advocate.focusAreas.map((fa) => (
                    <span
                      key={fa.id}
                      className="px-3 py-1 bg-primaryDefault rounded-full text-white text-sm font-medium"
                    >
                      {fa.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
