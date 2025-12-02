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
    title: 'Organization Structure',
    path: '/organization-structure',
    icon: 'Organization',
  },
  {
    title: 'Attendance',
    path: '/attendance', // Default path when clicking parent
    icon: 'Calendar',
    children: [
      {
        title: 'Dashboard',
        path: '/attendance',
      },
      {
        title: 'My Attendance',
        path: '/attendance/my-attendance',
      },
      {
        title: 'Regularization',
        path: '/attendance/regularization',
      },
      {
        title: 'Reports',
        path: '/attendance/reports',
      },
      {
        title: 'Admin',
        path: '/attendance/admin',
      },
      {
        title: 'Shifts',
        path: '/attendance/shifts',
      },
      {
        title: 'Holidays',
        path: '/attendance/holidays',
      },
    ],
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

