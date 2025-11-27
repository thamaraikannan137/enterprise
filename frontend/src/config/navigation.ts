// Navigation Configuration

export interface NavItemType {
  title: string;
  path?: string;
  icon?: string; // Icon name from MUI icons
  children?: NavItemType[];
}

export const navigationItems: NavItemType[] = [
  {
    title: 'Dashboard',
    path: '/',
    icon: 'Dashboard',
  },
  {
    title: 'Employees',
    path: '/employees',
    icon: 'People',
  },
  {
    title: 'About',
    path: '/about',
    icon: 'Info',
  },
  {
    title: 'Login',
    path: '/login',
    icon: 'Login',
  },
  {
    title: 'Register',
    path: '/register',
    icon: 'PersonAdd',
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: 'Settings',
  },
];

export const navigationConfig = {
  navWidth: 260,
  collapsedWidth: 80,
};

