/*
  Warnings:

  - Changed the type of `phoneNumber` on the `admin` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "phoneNumber",
ADD COLUMN     "phoneNumber" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_phoneNumber_key" ON "admin"("phoneNumber");
