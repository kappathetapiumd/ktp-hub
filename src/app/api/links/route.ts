import { addLink, deleteLink, getLinks } from '@/lib/links';

export async function GET() {
  const links = await getLinks();

  return Response.json(links);
}

export async function POST(request: Request) {
  const { label, url } = await request.json();

  const newLink = await addLink(label, url);

  return Response.json(newLink);
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id');

  if (!id) return Response.json({ error: 'No link id.' })

  await deleteLink(id);

  return Response.json({ success: true });
}
