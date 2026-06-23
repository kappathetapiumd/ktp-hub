import { getPledges } from "@/lib/pledges";

export async function GET() {
  const pledges = await getPledges();

  return Response.json(pledges);
}
