import { AUTH_ROUTES, PROTECTED_ROUTES } from "./routePath";
import SignIn from "@/pages/auth/sign-in";
import SignUp from "@/pages/auth/sign-up";
import Dashboard from "@/pages/dashboard";
import Transactions from "@/pages/transactions";
import Reports from "@/pages/reports";
import Categories from "@/pages/categories";
import Budget from "@/pages/budget";
import Goals from "@/pages/goals";
import Bills from "@/pages/bills";
import Settings from "@/pages/settings";
import Account from "@/pages/settings/account";
import Appearance from "@/pages/settings/appearance";
import Security from "@/pages/settings/security";
import Preferences from "@/pages/settings/preferences";
import Support from "@/pages/settings/support";
import Landing from "@/pages/landing";

export const authenticationRoutePaths = [
  { path: AUTH_ROUTES.LANDING, element: <Landing /> },
  { path: AUTH_ROUTES.SIGN_IN, element: <SignIn /> },
  { path: AUTH_ROUTES.SIGN_UP, element: <SignUp /> },
];

export const protectedRoutePaths = [
  { path: PROTECTED_ROUTES.OVERVIEW, element: <Dashboard /> },
  { path: PROTECTED_ROUTES.TRANSACTIONS, element: <Transactions /> },
  { path: PROTECTED_ROUTES.REPORTS, element: <Reports /> },
  { path: PROTECTED_ROUTES.CATEGORIES, element: <Categories /> },
  { path: PROTECTED_ROUTES.BUDGET, element: <Budget /> },
  { path: PROTECTED_ROUTES.GOALS, element: <Goals /> },
  { path: PROTECTED_ROUTES.BILLS, element: <Bills /> },
  {
    path: PROTECTED_ROUTES.SETTINGS,
    element: <Settings />,
    children: [
      { index: true, element: <Account /> }, // Default route
      { path: PROTECTED_ROUTES.SETTINGS, element: <Account /> },
      { path: PROTECTED_ROUTES.SETTINGS_APPEARANCE, element: <Appearance /> },
      { path: PROTECTED_ROUTES.SETTINGS_SECURITY, element: <Security /> },
      { path: PROTECTED_ROUTES.SETTINGS_PREFERENCES, element: <Preferences /> },
      { path: PROTECTED_ROUTES.SETTINGS_SUPPORT, element: <Support /> },
    ]
  },
];
