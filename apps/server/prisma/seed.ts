import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
import bcrypt from "bcrypt";

const connectionString = process.env.DATABASE_URL as string;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const plaintextPassword = "password123";
  const hashedPassword = await bcrypt.hash(plaintextPassword, 10);

  const user = await prisma.user.create({
    data: {
      password: hashedPassword,
      firstName: "Mister",
      lastName: "User",
      role: "USER",
      contactInfo: {
        create: {
          mobile: "123-456-7890",
          email: "mister.user@example.com",
        },
      },
    },
  });

  const admin = await prisma.user.create({
    data: {
      password: hashedPassword,
      firstName: "Adam",
      lastName: "Minister",
      role: "ADMIN",
      contactInfo: {
        create: {
          mobile: "123-456-7890",
          email: "adam.minister@example.com",
        },
      },
    },
  });

  console.log("Seeded admin:", admin);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
