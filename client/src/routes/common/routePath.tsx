export const isAuthRoute = (pathname: string): boolean => {
  return Object.values(AUTH_ROUTES).includes(pathname);
};

export const AUTH_ROUTES = {
  LANDING: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
};

export const PROTECTED_ROUTES = {
  OVERVIEW: "/overview",
  TRANSACTIONS: "/transactions",
  REPORTS: "/reports",
  CATEGORIES: "/categories",
  BUDGET: "/budget",
  GOALS: "/goals",
  BILLS: "/bills",
  SETTINGS: "/settings",
  SETTINGS_APPEARANCE: "/settings/appearance",
  SETTINGS_SECURITY: "/settings/security",
  SETTINGS_PREFERENCES: "/settings/preferences",
  SETTINGS_SUPPORT: "/settings/support",
};
