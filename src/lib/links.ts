import prisma from './prisma';

export async function getLinks() {
  const links = await prisma.link.findMany({
    orderBy: { label: 'asc' }
  });

  return links;
}

export async function addLink(label: string, url: string) {
  const newLink = await prisma.link.create({
    data: {
      label,
      url
    }
  });

  return newLink;
}

export async function deleteLink(id: string) {
  await prisma.link.deleteMany({
    where: { id }
  });
}
