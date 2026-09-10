import prisma from './prisma';
import { appliesToMember, type RequirementAudience } from './requirement-types';

export async function getRequirementUsers(type: string) {
  const roles = type === 'brothers' ? ['BROTHER' as const]
    : type === 'pledges' ? ['PCP_PCVP' as const, 'PLEDGE' as const]
    : ['BROTHER' as const, 'PCP_PCVP' as const, 'PLEDGE' as const];
  const users = await prisma.user.findMany({
    where: { isActive: true, role: { in: roles } },
    select: { id: true, name: true, role: true,
      requirementCompletions: { select: { requirementId: true } } },
    orderBy: [{ role: 'asc' }, { name: 'asc' }],
  });
  return users.map(({ requirementCompletions, ...user }) => ({
    ...user, completedRequirementIds: requirementCompletions.map(item => item.requirementId),
  }));
}
export async function getRequirements() {
  return prisma.requirement.findMany({ orderBy: [{ category: 'asc' }, { createdAt: 'asc' }, { id: 'asc' }] });
}
export async function saveRequirement(data: { name: string; category: string; appliesTo: RequirementAudience }, id?: string) {
  return id ? prisma.requirement.update({ where: { id }, data }) : prisma.requirement.create({ data });
}
export async function updateRequirement(userId: string, completed: boolean, requirementId: string) {
  return prisma.$transaction(async tx => {
    const [user, requirement] = await Promise.all([
      tx.user.findUnique({ where: { id: userId }, select: { role: true, isActive: true } }),
      tx.requirement.findUnique({ where: { id: requirementId } }),
    ]);
    if (!user?.isActive || !requirement || !appliesToMember(requirement, user.role)) return false;
    if (completed) {
      await tx.requirementCompletion.upsert({
        where: { userId_requirementId: { userId, requirementId } },
        create: { userId, requirementId }, update: {},
      });
    } else {
      await tx.requirementCompletion.deleteMany({ where: { userId, requirementId } });
    }
    return true;
  });
}
export async function deleteRequirement(id: string) {
  return prisma.requirement.deleteMany({ where: { id } });
}
export async function clearRequirements() {
  await prisma.requirementCompletion.deleteMany();
}
export async function getGroupTasks() {
  return prisma.groupTask.findMany({ orderBy: { name: 'asc' } });
}
export async function createGroupTask(req: string) {
  return prisma.groupTask.create({ data: { name: req } });
}
export async function toggleGroupTask(id: string, completed: boolean) {
  await prisma.groupTask.updateMany({ where: { id }, data: { completed } });
}
export async function deleteGroupReq(id: string) {
  await prisma.groupTask.deleteMany({ where: { id } });
}
