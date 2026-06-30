import bcrypt from "bcrypt";

import { prisma } from "@database/db";
import { createUser } from "@repository/user.repository";

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

  const {
    firstName: createdFirstName,
    lastName: createdLastName,
    role,
  } = await createUser({
    firstName,
    lastName,
    hashedPassword,
    email,
  });

  return { createdFirstName, createdLastName, role };
};
