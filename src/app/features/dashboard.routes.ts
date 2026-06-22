import { Routes } from "@angular/router";
import { LayoutComponent } from "./system-admin/layout/layout.component";
import { DashboardComponent } from "./system-admin/dashboard/dashboard.component";
import { CompanyComponent } from "./system-admin/company/company.component";

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