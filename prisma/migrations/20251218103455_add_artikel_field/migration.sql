-- CreateEnum
CREATE TYPE "Artikel" AS ENUM ('DER', 'DIE', 'DAS');

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "artikel" "Artikel";
