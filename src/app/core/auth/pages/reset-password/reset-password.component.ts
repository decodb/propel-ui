import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { IntersectionObserverDirective } from '../../../../shared/directives/intersection-observer.directive';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { ResetDialogState, ResetPasswordDialogComponent } from '../../components/reset-password-dialog/reset-password-dialog.component';

@Component({
  selector: 'app-reset-password',
  imports: [IntersectionObserverDirective, ReactiveFormsModule, RouterLink, ResetPasswordDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent implements OnInit{
  token = signal<string | null>('')

  // ── Dialog ──────────────────────────────────────────────────────────────────
  dialogVisible = false;
  dialogState: ResetDialogState = 'success';

  isLoading = signal<boolean>(false)
  showPassword = signal<boolean>(false);

  changePasswordFields = {
    password: false,
    confirmPassword: false
  }

  form = new FormGroup({
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    ]),
    confirmPassword: new FormControl('', [
      Validators.required,
      Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
    ])
  }, { validators: this.passwordMatchValidator })

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const tokenValue = this.route.snapshot.queryParamMap.get('token');
    this.token.set(tokenValue);
    
    if (!this.token()) {
      this.router.navigate(['forgot-password']);
    }
  }

  // ── Form submission ──────────────────────────────────────────────────────────
  onSubmit(): void {
    if (this.form.invalid) return;
  
    this.isLoading.set(true);
    this.authService.resetPassword(this.token()!, this.form.controls.password.value!).subscribe({
      next: (err) => {
        console.log(err)
        this.dialogState = 'success';
        this.dialogVisible = true;
        this.isLoading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        console.log(err.error.message)
        this.dialogState = err.status === 409 ? 'invalid_token' : 'server_error';
        this.dialogVisible = true;
        this.isLoading.set(false);
      }
    })
  }

  hasError(path: string | string[], error: string): boolean {
    const control = this.form.get(path);
    return !!control && control.hasError(error) && (control.dirty || control.touched);
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onDialogClose(): void {
    this.dialogVisible = false;
  }

  onRetry(): void {
    // Form values are preserved so the user can resubmit immediately
    this.dialogVisible = false;
  }

  // ── Misc ─────────────────────────────────────────────────────────────────────

  togglePassword() {
    this.showPassword.set(!this.showPassword())
  }

  /** Triggers field entrance animation once the form scrolls into view */
  onForgotPasswordFormIntersection(isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.changePasswordFields.password = true; }, 500);
      setTimeout(() => { this.changePasswordFields.confirmPassword = true; }, 1000);
    }
  }
}
