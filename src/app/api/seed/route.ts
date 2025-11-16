import { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import db from "../../../db";
import {
  advocates,
  specialties,
  focusAreas,
  advocateFocusAreas,
} from "../../../db/schema";
import {
  advocateData,
  specialtiesWithFocusAreas,
  getRandomFocusAreaIds,
} from "../../../db/seed/advocates";
import { SQL, Placeholder } from "drizzle-orm";

export async function POST() {
  try {
    const insertedSpecialties = await db
      .insert(specialties)
      .values(specialtiesWithFocusAreas.map((s) => ({ name: s.specialty })))
      .onConflictDoNothing()
      .returning();

    console.info(`Inserted ${insertedSpecialties.length} specialties`);

    // Fetch all specialties to ensure you have all IDs
    const allSpecialties = await db.select().from(specialties);
    const specialtyMap = new Map(allSpecialties.map((s) => [s.name, s.id]));

    const focusAreaValues: { specialtyId: number; name: string }[] = [];
    specialtiesWithFocusAreas.forEach((item) => {
      const specialtyId = specialtyMap.get(item.specialty);
      if (!specialtyId) {
        throw new Error(`Specialty not found: ${item.specialty}`);
      }
      item.focusAreas.forEach((focusArea) => {
        focusAreaValues.push({
          specialtyId,
          name: focusArea,
        });
      });
    });

    const insertedFocusAreas = await db
      .insert(focusAreas)
      .values(focusAreaValues)
      .returning();

    console.info(`Inserted ${insertedFocusAreas.length} focus areas`);

    const insertedAdvocates = await db
      .insert(advocates)
      .values(advocateData)
      .returning();

    console.info(`Inserted ${insertedAdvocates.length} advocates`);

    const relationships = insertedAdvocates.flatMap((advocate) => {
      // Assign 3-8 random focus areas to every advocate
      const numFocusAreas = Math.floor(Math.random() * 6) + 3; // 3 to 8
      const focusAreaIds = getRandomFocusAreaIds(
        insertedFocusAreas.length,
        numFocusAreas
      );
      return focusAreaIds.map((focusAreaId) => ({
        advocateId: advocate.id,
        focusAreaId,
      }));
    });

    const insertedRelationships = await db
      .insert(advocateFocusAreas)
      .values(relationships)
      .returning();

    console.info(
      `Created ${insertedRelationships.length} advocate-focus area relationships`
    );

    return Response.json({
      success: true,
      advocates: insertedAdvocates.length,
      specialties: insertedSpecialties.length,
      focusAreas: insertedFocusAreas.length,
      relationships: insertedRelationships.length,
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Failed to seed database" }, { status: 500 });
  }
}
