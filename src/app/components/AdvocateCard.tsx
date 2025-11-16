import React from "react";

type Specialties = {
  id: number | null;
  name: string;
};

type FocusAreas = {
  id: number | null;
  name: string;
};

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

export function AdvocateCard({ advocate }: { advocate: Advocate }) {
  return (
    <div className="flex flex-row items-center border border-gray-300 rounded-lg p-6 w-full shadow-md bg-gradient-to-r from-accentMid/20 via-white to-white">
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
          <span className="font-semibold">Years of Experience:</span> {advocate.yearsOfExperience}
        </p>
        <p>
          <span className="font-semibold">Phone Number:</span> {advocate.phoneNumber}
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
  );
}