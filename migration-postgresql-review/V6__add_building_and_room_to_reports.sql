-- Migration: Add building and room columns to reports table
ALTER TABLE reports
ADD COLUMN building VARCHAR(50) NULL,
ADD COLUMN room VARCHAR(150) NULL;

-- Safely backfill existing records
UPDATE reports
SET building = CASE 
    WHEN id = 1 THEN 'GK1'
    WHEN id = 2 THEN 'GK2'
    WHEN id = 3 THEN 'GK3'
    WHEN id = 4 THEN 'GA'
    WHEN id = 5 THEN 'PARKING_LOT'
    ELSE 'OTHER'
END,
room = CASE
    WHEN id = 1 THEN 'Lantai 2 Koridor Ruang Kuliah 204'
    WHEN id = 2 THEN 'Laboratorium Komputer 302'
    WHEN id = 3 THEN 'Toilet Pria Lantai 1'
    WHEN id = 4 THEN 'Kantin & Area Terbuka'
    WHEN id = 5 THEN 'Area Parkir Barat'
    WHEN location IS NOT NULL AND location != '' THEN location
    ELSE 'Area Kampus'
END
WHERE building IS NULL;

-- Make columns NOT NULL
ALTER TABLE reports
ALTER COLUMN building SET NOT NULL,
ALTER COLUMN room SET NOT NULL;
