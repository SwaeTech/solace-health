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
  const dba = db as PostgresJsDatabase;

  try {
    const insertedSpecialties = await dba
      .insert(specialties)
      .values(specialtiesWithFocusAreas.map((s) => ({ name: s.specialty })))
      .onConflictDoNothing()
      .returning();

    console.info(`Inserted ${insertedSpecialties.length} specialties`);

    const focusAreaValues:
      | {
          name: string | SQL<unknown> | Placeholder<string, any>;
          specialtyId: number | SQL<unknown> | Placeholder<string, any>;
          id?: number | SQL<unknown> | Placeholder<string, any> | undefined;
          createdAt?:
            | SQL<unknown>
            | Date
            | Placeholder<string, any>
            | null
            | undefined;
        }[]
      | { specialtyId: number; name: string }[] = [];
    specialtiesWithFocusAreas.forEach((item, index) => {
      const specialty = insertedSpecialties[index];
      item.focusAreas.forEach((focusArea) => {
        focusAreaValues.push({
          specialtyId: specialty.id,
          name: focusArea,
        });
      });
    });

    const insertedFocusAreas = await dba
      .insert(focusAreas)
      .values(focusAreaValues)
      .returning();

    console.info(`Inserted ${insertedFocusAreas.length} focus areas`);

    const insertedAdvocates = await dba
      .insert(advocates)
      .values(advocateData)
      .returning();

    console.info(`Inserted ${insertedAdvocates.length} advocates`);

    const relationships = insertedAdvocates.flatMap((advocate) => {
      const focusAreaIds = getRandomFocusAreaIds(insertedFocusAreas.length, 8);
      return focusAreaIds.map((focusAreaId) => ({
        advocateId: advocate.id,
        focusAreaId,
      }));
    });

    const insertedRelationships = await dba
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
