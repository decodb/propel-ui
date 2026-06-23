import { Routes } from "@angular/router";
import { LayoutComponent } from "./system-admin/layout/layout.component";
import { DashboardComponent } from "./system-admin/pages/dashboard/dashboard.component";
import { CompanyComponent } from "./system-admin/pages/company/company.component";

export const DASHBOARD_ROUTES: Routes = [
    // admin routes
    {
        path: 'admin',
        component: LayoutComponent,
        // canActivate: [],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            }, 
            {
                path: 'company',
                component: CompanyComponent
            }
        ]
    }
]