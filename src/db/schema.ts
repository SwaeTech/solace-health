import { InferSelectModel, sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  serial,
  timestamp,
  bigint,
  primaryKey,
  index,
  pgView,
} from "drizzle-orm/pg-core";

export const advocates = pgTable(
  "advocates",
  {
    id: serial("id").primaryKey(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    nameIdx: index("name_idx").on(table.firstName, table.lastName),
    cityIdx: index("city_idx").on(table.city),
  })
);

// Specialties are the parent categories
export const specialties = pgTable(
  "specialties",
  {
    id: serial("id").primaryKey(),
    name: text("name").notNull().unique(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    nameIdx: index("specialty_name_idx").on(table.name),
  })
);

// Focus areas belong to specialties
export const focusAreas = pgTable(
  "focus_areas",
  {
    id: serial("id").primaryKey(),
    specialtyId: integer("specialty_id")
      .notNull()
      .references(() => specialties.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    specialtyIdx: index("focus_area_specialty_idx").on(table.specialtyId),
    nameIdx: index("focus_area_name_idx").on(table.name),
  })
);

// This gives you the most flexibility and a reference link from advocates to specialties
export const advocateFocusAreas = pgTable(
  "advocate_focus_areas",
  {
    advocateId: integer("advocate_id")
      .notNull()
      .references(() => advocates.id, { onDelete: "cascade" }),
    focusAreaId: integer("focus_area_id")
      .notNull()
      .references(() => focusAreas.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.advocateId, table.focusAreaId] }),
    advocateIdx: index("advocate_focus_area_advocate_idx").on(table.advocateId),
    focusAreaIdx: index("advocate_focus_area_focus_idx").on(table.focusAreaId),
  })
);

// Create a custom view using a custom drizzle migration file, sicnce views are not yet supported natively
export const advocateSpecialtyFocusView = pgView(
  "advocate_specialty_focus_view",
  {
    advocateId: integer("advocate_id").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),
    city: text("city").notNull(),
    degree: text("degree").notNull(),
    yearsOfExperience: integer("years_of_experience").notNull(),
    phoneNumber: bigint("phone_number", { mode: "number" }).notNull(),
    focusAreaId: integer("focus_area_id").notNull(),
    focusAreaName: text("focus_area_name").notNull(),
    specialtyId: integer("specialty_id").notNull(),
    specialtyName: text("specialty_name").notNull(),
  }
).as(sql`SELECT
  a.id AS advocate_id,
  a.first_name,
  a.last_name,
  a.city,
  a.degree,
  a.years_of_experience,
  a.phone_number,
  fa.id AS focus_area_id,
  fa.name AS focus_area_name,
  s.id AS specialty_id,
  s.name AS specialty_name
FROM ${advocateFocusAreas} afa
JOIN ${advocates} a ON afa.advocate_id = a.id
JOIN ${focusAreas} fa ON afa.focus_area_id = fa.id
JOIN ${specialties} s ON fa.specialty_id = s.id`);

export type Advocate = typeof advocates.$inferSelect;
export type Specialty = typeof specialties.$inferSelect;
export type FocusArea = typeof focusAreas.$inferSelect;
export type AdvocateSpecialtyFocusViewRow = typeof advocateSpecialtyFocusView.$inferSelect;
