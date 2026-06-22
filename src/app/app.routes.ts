import { Routes } from '@angular/router';
import { PUBLIC_ROUTES } from './core/layout/public/public.routes';
import { AUTH_ROUTES } from './core/auth/auth.routes';
import { DASHBOARD_ROUTES } from './features/dashboard.routes';

export const routes: Routes = [
    ...PUBLIC_ROUTES,
    ...AUTH_ROUTES,
    ...DASHBOARD_ROUTES
];
