import { Routes } from "@angular/router";
import { SignUpComponent } from "./pages/sign-up/sign-up.component";
import { SignInComponent } from "./pages/sign-in/sign-in.component";
import { ForgotPasswordComponent } from "./pages/forgot-password/forgot-password.component";
import { VerifyEmailComponent } from "./pages/verify-email/verify-email.component";

export const AUTH_ROUTES: Routes = [
    // Auth pages
    {
        path: 'sign-up',
        component: SignUpComponent
    },
    {
        path: 'verify-email',
        component: VerifyEmailComponent
    },
    {
        path: 'sign-in',
        component: SignInComponent
    },
    {
        path: 'forgot-password',
        component: ForgotPasswordComponent
    }
];