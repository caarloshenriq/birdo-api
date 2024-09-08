-- AlterTable
ALTER TABLE "post" ALTER COLUMN "image" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "birth_date" DROP NOT NULL,
ALTER COLUMN "profile_image" DROP NOT NULL,
ALTER COLUMN "profile_image" SET DATA TYPE TEXT;
