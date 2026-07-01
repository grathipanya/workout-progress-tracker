import { prisma } from "@package/db";
import type { ContactInfo, User } from "@package/db/generated/prisma/client";

type CreateUserProps = {
  firstName: User["firstName"];
  lastName: User["lastName"];
  hashedPassword: User["password"];
  email: ContactInfo["email"];
};

export const createUser = async ({ firstName, lastName, hashedPassword, email }: CreateUserProps) =>
  await prisma.user.create({
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

export const findUserByEmail = async (email: ContactInfo["email"]) => {
  const contact = await prisma.contactInfo.findUnique({
    where: { email },
    include: {
      user: true,
    },
  });

  return contact?.user
    ? {
        ...contact.user,
        contactInfo: contact,
      }
    : null;
};

export const findUserById = async (userId: User["user_id"]) => {
  const user = await prisma.user.findUnique({
    where: { user_id: userId },
    include: {
      contactInfo: true,
    },
  });

  return user;
};
