import db from "../../../db";
import { advocates, advocateSpecialtyFocusView } from "../../../db/schema";
import { asc, count, inArray } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(parseInt(searchParams.get("limit") ?? "20", 10), 1);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);

  // Page by unique advocates (not by view rows)
  const [pageAdvocates, [{ total }]] = await Promise.all([
    db
      .select()
      .from(advocates)
      .orderBy(asc(advocates.id))
      .limit(limit)
      .offset(offset),
    db.select({ total: count() }).from(advocates),
  ]);

  if (pageAdvocates.length === 0) {
    return Response.json({ data: [], nextOffset: null, total: Number(total) });
  }

  const ids = pageAdvocates.map((a: { id: any }) => a.id);

  // Pull all relations for the advocates in this page
  const rows = await db
    .select()
    .from(advocateSpecialtyFocusView)
    .where(inArray(advocateSpecialtyFocusView.advocateId, ids));

  // Seed map with base advocate info to include those with 0 relations
  const map = new Map<
    number,
    {
      advocateId: number;
      firstName: string;
      lastName: string;
      city: string;
      degree: string;
      yearsOfExperience: number;
      phoneNumber: number;
      specialties: { id: number | null; name: string }[];
      focusAreas: { id: number | null; name: string }[];
    }
  >();

  for (const a of pageAdvocates) {
    map.set(a.id, {
      advocateId: a.id,
      firstName: a.firstName,
      lastName: a.lastName,
      city: a.city,
      degree: a.degree,
      yearsOfExperience: a.yearsOfExperience,
      phoneNumber: a.phoneNumber,
      specialties: [],
      focusAreas: [],
    });
  }

  // Merge specialties and focus areas, deduping per advocate
  for (const row of rows) {
    if (row.advocateId == null) continue;
    const adv = map.get(row.advocateId);
    if (!adv) continue;

    if (
      row.specialtyId != null &&
      !adv.specialties.some((s) => s.id === row.specialtyId)
    ) {
      adv.specialties.push({ id: row.specialtyId, name: row.specialtyName });
    }

    if (
      row.focusAreaId != null &&
      !adv.focusAreas.some((f) => f.id === row.focusAreaId)
    ) {
      adv.focusAreas.push({ id: row.focusAreaId, name: row.focusAreaName });
    }
  }

  // Preserve page ordering
  const data = ids.map((id: number) => map.get(id)!);
  const nextOffset = offset + limit < Number(total) ? offset + limit : null;

  return Response.json({ data, nextOffset, total: Number(total) });
}
