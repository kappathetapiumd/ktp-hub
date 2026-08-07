import { pusherServer } from '@/lib/pusher/server';

export async function POST(request: Request) {
  const data = await request.formData();

  const socketId = data.get('socket_id') as string;
  const channelName = data.get('channel_name') as string;

  if (channelName !== 'private-strikes')
    return Response.json({ error: 'Forbidden' }, { status: 403 });

  const authResponse = pusherServer.authorizeChannel(
    socketId,
    channelName
  );

  return Response.json(authResponse);
}
