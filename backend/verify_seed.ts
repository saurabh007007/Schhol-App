import { PrismaClient } from "@prisma/client";
import fs from "fs";

const prisma = new PrismaClient();

async function main() {
  try {
    const userCount = await prisma.user.count();
    const schoolProfileCount = await prisma.schoolProfile.count();

    const output = `User count: ${userCount}\nSchool Profile count: ${schoolProfileCount}`;
    fs.writeFileSync("verification_result.txt", output);
  } catch (e) {
    fs.writeFileSync("verification_result.txt", `Error: ${e}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
