import db from "../../../db";
import { advocates, advocateSpecialtyFocusView } from "../../../db/schema";
import { asc, count, countDistinct, inArray, ilike, or, sql } from "drizzle-orm";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Math.max(parseInt(searchParams.get("limit") ?? "20", 10), 1);
  const offset = Math.max(parseInt(searchParams.get("offset") ?? "0", 10), 0);
  const q = (searchParams.get("q") ?? "").trim();

  // When searching, page by DISTINCT advocate IDs that match any field in the view.
  if (q.length > 0) {
    const pattern = `%${q}%`;

    const whereClause = or(
      ilike(advocateSpecialtyFocusView.firstName, pattern),
      ilike(advocateSpecialtyFocusView.lastName, pattern),
      ilike(advocateSpecialtyFocusView.city, pattern),
      ilike(advocateSpecialtyFocusView.degree, pattern),
      ilike(advocateSpecialtyFocusView.specialtyName, pattern),
      ilike(advocateSpecialtyFocusView.focusAreaName, pattern),
      // numeric -> text casts
      sql`${advocateSpecialtyFocusView.yearsOfExperience}::text ILIKE ${pattern}`,
      sql`${advocateSpecialtyFocusView.phoneNumber}::text ILIKE ${pattern}`
    );

    const [pageIds, [{ total }]] = await Promise.all([
      db
        .selectDistinct({ id: advocateSpecialtyFocusView.advocateId })
        .from(advocateSpecialtyFocusView)
        .where(whereClause)
        .orderBy(asc(advocateSpecialtyFocusView.advocateId))
        .limit(limit)
        .offset(offset),
      db
        .select({ total: countDistinct(advocateSpecialtyFocusView.advocateId) })
        .from(advocateSpecialtyFocusView)
        .where(whereClause),
    ]);

    if (pageIds.length === 0) {
      return Response.json({ data: [], nextOffset: null, total: Number(total) });
    }

    const ids = pageIds.map((r) => r.id);

    const rows = await db
      .select()
      .from(advocateSpecialtyFocusView)
      .where(inArray(advocateSpecialtyFocusView.advocateId, ids));

    // Group rows -> advocates
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

    for (const row of rows) {
      if (!map.has(row.advocateId)) {
        map.set(row.advocateId, {
          advocateId: row.advocateId,
          firstName: row.firstName,
          lastName: row.lastName,
          city: row.city,
          degree: row.degree,
          yearsOfExperience: row.yearsOfExperience,
          phoneNumber: row.phoneNumber,
          specialties: [],
          focusAreas: [],
        });
      }
      const adv = map.get(row.advocateId)!;

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

    const data = ids.map((id) => map.get(id)!).filter(Boolean);
    const nextOffset = offset + limit < Number(total) ? offset + limit : null;

    return Response.json({ data, nextOffset, total: Number(total) });
  }

  // No search: page by unique advocates (ensures advocates with 0 relations are included)
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

  const ids = pageAdvocates.map((a) => a.id);

  const rows = await db
    .select()
    .from(advocateSpecialtyFocusView)
    .where(inArray(advocateSpecialtyFocusView.advocateId, ids));

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

  for (const row of rows) {
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

  const data = ids.map((id) => map.get(id)!);
  const nextOffset = offset + limit < Number(total) ? offset + limit : null;

  return Response.json({ data, nextOffset, total: Number(total) });
}
