import bcrypt from "bcrypt";

import { prisma } from "@database/db";

type RegisterUserProps = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export const registerUserService = async ({
  firstName,
  lastName,
  email,
  password,
}: RegisterUserProps) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  return await prisma.user.create({
    data: {
      firstName,
      lastName,
      password: hashedPassword,
      contactInfo: {
        create: {
          email,
        },
      },
    },
  });
};
