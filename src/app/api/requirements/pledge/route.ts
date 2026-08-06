import { createGroupTask, deleteGroupReq, getGroupTasks, toggleGroupTask } from '@/lib/requirements';

export async function GET() {
  const groupTasks = await getGroupTasks();

  return Response.json(groupTasks);
}

export async function POST(request: Request) {
  const { req } = await request.json();

  const newGroupTask = await createGroupTask(req);

  return Response.json(newGroupTask);
}

export async function PUT(request: Request) {
  const { id, completed } = await request.json();

  await toggleGroupTask(id, completed);

  return Response.json({ success: true });
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);

  const id = searchParams.get('id')!;

  await deleteGroupReq(id);

  return Response.json({ success: true });
}
