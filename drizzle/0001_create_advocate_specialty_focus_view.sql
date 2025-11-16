CREATE VIEW advocate_specialty_focus_view AS
SELECT
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
FROM advocate_focus_areas afa
JOIN advocates a ON afa.advocate_id = a.id
JOIN focus_areas fa ON afa.focus_area_id = fa.id
JOIN specialties s ON fa.specialty_id = s.id;