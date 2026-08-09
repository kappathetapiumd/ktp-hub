import type { CurrentUser } from '@/lib/auth/currentUser';

export type AppRoute = {
  href: string;
  label: string;
  description: string;
  icon: string;
  accent: string;
};

const commonRoutes: AppRoute[] = [
  {
    href: '/home',
    label: 'Home',
    description: 'Return to your KTP Hub overview.',
    icon: 'fa-house',
    accent: 'teal'
  },
  {
    href: '/strikes',
    label: 'Strikes',
    description: 'Review pledge strikes and weekly activity.',
    icon: 'fa-bolt',
    accent: 'blue'
  },
  {
    href: '/requirements',
    label: 'Requirements',
    description: 'Track individual and group requirements.',
    icon: 'fa-list-check',
    accent: 'violet'
  },
  {
    href: '/links',
    label: 'Links',
    description: 'Find shared chapter tools and resources.',
    icon: 'fa-link',
    accent: 'amber'
  }
];

const membersRoute: AppRoute = {
  href: '/users',
  label: 'Members',
  description: 'Manage member roles, status, and access.',
  icon: 'fa-users',
  accent: 'rose'
};

const inactiveMembersRoute: AppRoute = {
  href: '/users/deleted',
  label: 'Inactive Members',
  description: 'Review and restore archived member accounts.',
  icon: 'fa-box-archive',
  accent: 'slate'
};

export function getAppRoutes(user: CurrentUser) {
  const routes = [...commonRoutes];

  if (user.role === 'ADMIN' || user.role === 'OWNER') routes.push(membersRoute);
  if (user.role === 'OWNER') routes.push(inactiveMembersRoute);

  return routes;
}
