import type { User, ContactInfo } from "@package/db/generated/prisma/browser";

export type SignInProps = {
  email: ContactInfo["email"];
  password: User["password"];
};

// export type SignInResponse = {
//   user: User;
// };
