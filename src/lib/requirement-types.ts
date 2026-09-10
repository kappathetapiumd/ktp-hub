export type RequirementAudience = 'ALL' | 'BROTHERS' | 'PLEDGES';
export type Requirement = {
  id: string;
  name: string;
  category: string;
  appliesTo: RequirementAudience;
};
export type RequirementUser = {
  id: string;
  name: string;
  role: string;
  completedRequirementIds: string[];
};
export const audienceLabels = {
  ALL: 'Brothers & Pledges',
  BROTHERS: 'Brothers Only',
  PLEDGES: 'Pledges Only',
};
export const audienceShortLabels = {
  ALL: 'All Members',
  BROTHERS: 'Brothers',
  PLEDGES: 'Pledges',
};
export function appliesToMember(requirement: Pick<Requirement, 'appliesTo'>, role: string) {
  const brother = role === 'BROTHER';
  const pledge = role === 'PLEDGE' || role === 'PCP_PCVP';
  return (brother || pledge) && (requirement.appliesTo === 'ALL'
    || (requirement.appliesTo === 'BROTHERS' && brother)
    || (requirement.appliesTo === 'PLEDGES' && pledge));
}
