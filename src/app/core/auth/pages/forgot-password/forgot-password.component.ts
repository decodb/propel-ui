import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../shared/directives/intersection-observer.directive";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { DialogState, ForgotPasswordDialogComponent } from '../../components/forgot-password-dialog/forgot-password-dialog.component';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, IntersectionObserverDirective, ReactiveFormsModule, ForgotPasswordDialogComponent, RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {

  // ── Dialog ──────────────────────────────────────────────────────────────────
  /** Controls whether the response dialog is visible */
  dialogVisible = false;
  /** Which state the dialog renders: 'success' | 'rate_limited' | 'server_error' */
  dialogState: DialogState = 'success';

  // ── UI state ────────────────────────────────────────────────────────────────
  /** Toggles password field visibility (not used here but kept for shared auth layout) */
  showPassword = signal<boolean>(false);
  /** True while the forgot-password API call is in flight */
  isLoading = signal<boolean>(false);

  // ── Intersection / entrance animations ──────────────────────────────────────
  /** Tracks which fields have entered the viewport so CSS entrance classes apply */
  forgotPasswordField = {
    email: false
  }

  // ── Form ────────────────────────────────────────────────────────────────────
  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  })

  constructor(private authService: AuthService) {}

  // ── Helpers ─────────────────────────────────────────────────────────────────

  /** Returns true when a field has a specific error and has been interacted with */
  hasError(path: string | string[], error: string): boolean {
    const control = this.form.get(path);
    return !!control && control.hasError(error) && (control.dirty || control.touched);
  }

  // ── Form submission ──────────────────────────────────────────────────────────

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next: () => {
        // 200 — show success dialog regardless of whether the email exists
        // (404s are handled the same way on the backend to prevent email enumeration)
        this.dialogState = 'success';
        this.dialogVisible = true;
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        // 429 → user has requested too many links; show rate limit countdown
        // anything else → generic server error
        this.dialogState = err.status === 429 ? 'rate_limited' : 'server_error';
        this.dialogVisible = true;
        this.isLoading.set(false);
      }
    });
  }

  // ── Dialog event handlers ────────────────────────────────────────────────────

  /** Called when the user dismisses the dialog (close button, backdrop, or Done) */
  onDialogClose(): void {
    this.dialogVisible = false;
  }

  /** Called when the user clicks "Try again" inside the server_error state */
  onRetry(): void {
    this.dialogVisible = false;
    // Form values are preserved so the user can resubmit immediately
  }

  /** Called when the user clicks "Resend email" inside the success state */
  onResend(): void {
    this.authService.forgotPassword(this.form.value.email!).subscribe({
      next:  () => this.dialogState = 'success',
      error: (err) => {
        this.dialogState = err.status === 429 ? 'rate_limited' : 'server_error';
      }
    });
  }

  // ── Misc ─────────────────────────────────────────────────────────────────────

  togglePassword() {
    this.showPassword.set(!this.showPassword())
  }

  /** Triggers field entrance animation once the form scrolls into view */
  onForgotPasswordFormIntersection(isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.forgotPasswordField.email = true; }, 500)
    }
  }
}