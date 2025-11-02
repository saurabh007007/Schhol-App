/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('STUDENT', 'TEACHER', 'ADMIN', 'PARENT');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('MALE', 'FEMALE', 'OTHER');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "CLASS" AS ENUM ('FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH', 'NINTH', 'TENTH', 'ELEVENTH', 'TWELFTH');

-- CreateEnum
CREATE TYPE "Section" AS ENUM ('A', 'B', 'C', 'D');

-- CreateEnum
CREATE TYPE "RELEGION" AS ENUM ('HINDU', 'MUSLIM', 'CHRISTIAN', 'SIKH', 'BUDDHIST', 'JAIN', 'OTHER');

-- DropTable
DROP TABLE "public"."User";

-- CreateTable
CREATE TABLE "admin" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roles" "Role" NOT NULL DEFAULT 'ADMIN',
    "loginStatus" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "fatherName" TEXT NOT NULL,
    "motherName" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,
    "class" "CLASS" NOT NULL,
    "section" "Section" NOT NULL,
    "rollNumber" INTEGER,
    "bloodGroup" TEXT,
    "address" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "relegion" "RELEGION" NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "photo" TEXT,
    "email" TEXT,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_phoneNumber_key" ON "admin"("phoneNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");
