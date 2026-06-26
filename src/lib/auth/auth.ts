import prisma from '../prisma';

export async function getUser(email: string) {
  const existingUser = await prisma.user.findFirst({
    where: { email }
  });

  return existingUser;
}

export async function addUser(
  email: string, name: string, hashedPassword: string, salt: string
) {
  const user = await prisma.user.create({
    data: {
      email,
      name,
      hashedPassword,
      salt
    }
  });

  return user;
}
