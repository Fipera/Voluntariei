import { PrismaClient } from '@prisma/client';


const skills = [
  "School tutoring",
  "Literacy",
  "Computer lessons",
  "Health campaigns",
  "First aid",
  "Elderly care",
  "Painting",
  "Masonry",
  "Carpentry",
  "Electricity",
  "Music",
  "Theater",
  "Drawing",
  "Photography",
  "Cooking",
  "Event organization",
  "Public speaking",
  "Food distribution",
  "Reception",
  "Fundraising",
  "Cleaning",
  "Transportation",
  "Sewing",
  "Child care",
  "Social media",
];





const prisma = new PrismaClient();

async function main() {
  for (const name of skills) {
    await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log("✅ Skills seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
