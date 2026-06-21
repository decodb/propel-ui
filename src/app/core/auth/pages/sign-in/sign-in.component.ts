import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../shared/directives/intersection-observer.directive";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { SignInDto } from '../../auth.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetDialogState, ServerErrorDialogComponent } from "../../../../shared/components/server-error-dialog/server-error-dialog.component";

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, IntersectionObserverDirective, ReactiveFormsModule, ServerErrorDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss'
})
export class SignInComponent {
  showPassword = signal<boolean>(false);
  signInFields = {
    email: false,
    password: false
  }
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

    // ── Dialog ──────────────────────────────────────────────────────────────────
    dialogVisible = false;
    dialogState: ResetDialogState = 'server_error';

  constructor (private authService: AuthService) {}

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('', [
      Validators.required
    ]),
  })

  // check if a field has an error
  hasError(path: string | string[], error: string): boolean {
    const control = this.form.get(path);
    return !!control && control.hasError(error) && (control.dirty || control.touched);
  }

  onSubmit() {
    if (this.form.invalid) return

    const data: SignInDto = {
      email: this.form.controls.email.value!,
      password: this.form.controls.password.value!
    }

    this.isLoading.set(true);

    this.authService.adminLogin(data)
      .subscribe({
        next: () => { 
          // coming up
        },
        error: (err: HttpErrorResponse) => { 
          console.log(err)
          if (err.error.statusCode === 401) {
            this.errorMessage.set('Invalid credentials. ')
          } else {
            this.dialogState = 'server_error';
            this.dialogVisible = true;
          }
          this.isLoading.set(false);
        },
        complete: () => { this.isLoading.set(false); this.form.reset(); },
      })
  }

  onRetry(): void {
    // Form values are preserved so the user can resubmit immediately
    this.dialogVisible = false;
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword())
  }

  onSignInFormIntersection (isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.signInFields.email = true; }, 500);
      setTimeout(() => { this.signInFields.password = true; }, 1000);
    }
  }
}
