import db from "../../../db";
import { advocateSpecialtyFocusView } from "../../../db/schema";

export async function GET() {
  const rows = await db.select().from(advocateSpecialtyFocusView);

  // Group by advocate_id
  const advocatesMap = new Map();

  for (const row of rows) {
    if (!advocatesMap.has(row.advocateId)) {
      advocatesMap.set(row.advocateId, {
        advocateId: row.advocateId,
        firstName: row.firstName,
        lastName: row.lastName,
        city: row.city,
        degree: row.degree,
        yearsOfExperience: row.yearsOfExperience,
        phoneNumber: row.phoneNumber,
        focusAreas: [],
        specialties: [],
      });
    }
    const advocate = advocatesMap.get(row.advocateId);
    
    // Add focus areas
    advocate.focusAreas.push({
      id: row.focusAreaId,
      name: row.focusAreaName,
    });

    // Add specialties
    advocate.specialties.push({
      id: row.specialtyId,
      name: row.specialtyName,
    });
  }

  const data = Array.from(advocatesMap.values());

  return Response.json({ data });
}
