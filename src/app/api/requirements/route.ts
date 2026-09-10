import { clearRequirements, deleteRequirement, getRequirements, getRequirementUsers, saveRequirement, updateRequirement } from '@/lib/requirements';
import { getCurrentUser } from '@/lib/auth/currentUser';
import type { RequirementAudience } from '@/lib/requirement-types';

const error = (message: string, status = 400) => Response.json({ error: message }, { status });
async function canManage() {
  const user = await getCurrentUser();
  return user?.role === 'OWNER' || user?.role === 'ADMIN';
}
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) return error('Unauthorized', 401);
  if (!['OWNER', 'ADMIN', 'BROTHER', 'PCP_PCVP', 'PLEDGE'].includes(user.role)) return error('Forbidden', 403);
  const requested = new URL(request.url).searchParams.get('type') || 'all';
  if (!['all', 'brothers', 'pledges'].includes(requested)) return error('Invalid member group.');
  const type = user.role === 'OWNER' || user.role === 'ADMIN' ? requested
    : user.role === 'BROTHER' ? 'brothers' : 'pledges';
  const [users, requirements] = await Promise.all([getRequirementUsers(type), getRequirements()]);
  return Response.json({ users, requirements: requirements.filter(req => type === 'all'
    || req.appliesTo === 'ALL' || req.appliesTo === (type === 'brothers' ? 'BROTHERS' : 'PLEDGES')) });
}
async function writeDefinition(request: Request, editing: boolean) {
  if (!await canManage()) return error('Forbidden', 403);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.name !== 'string' || typeof body.category !== 'string'
    || !['ALL', 'BROTHERS', 'PLEDGES'].includes(body.appliesTo)
    || (editing && (typeof body.id !== 'string' || !body.id))) return error('Name, category, and applies to are required.');
  const name = body.name.trim();
  const category = body.category.trim();
  if (!name || name.length > 100 || !category || category.length > 80) return error('Use a name of 1–100 characters and a category of 1–80 characters.');
  try {
    return Response.json(await saveRequirement({ name, category, appliesTo: body.appliesTo as RequirementAudience }, editing ? body.id : undefined), { status: editing ? 200 : 201 });
  } catch (cause) {
    if (cause && typeof cause === 'object' && 'code' in cause && cause.code === 'P2025') return error('Requirement no longer exists. Refresh the tracker.', 404);
    throw cause;
  }
}
export async function POST(request: Request) { return writeDefinition(request, false); }
export async function PATCH(request: Request) { return writeDefinition(request, true); }
export async function PUT(request: Request) {
  if (!await canManage()) return error('Forbidden', 403);
  const body = await request.json().catch(() => null);
  if (!body || typeof body.id !== 'string' || !body.id || typeof body.requirementId !== 'string'
    || !body.requirementId || typeof body.completed !== 'boolean') return error('Invalid completion update.');
  if (!await updateRequirement(body.id, body.completed, body.requirementId)) return error('This requirement does not apply to this member or no longer exists.', 409);
  return Response.json({ success: true });
}
export async function DELETE(request: Request) {
  if (!await canManage()) return error('Forbidden', 403);
  const params = new URL(request.url).searchParams;
  if (params.has('id')) {
    const id = params.get('id');
    if (!id) return error('Requirement id is required.');
    await deleteRequirement(id);
  } else if (params.get('action') === 'clear-progress') {
    await clearRequirements();
  } else return error('Specify a requirement or clear-progress action.');
  return Response.json({ success: true });
}
