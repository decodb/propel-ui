import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../shared/directives/intersection-observer.directive";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';
import { SignInDto } from '../../auth.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, IntersectionObserverDirective, ReactiveFormsModule],
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
  errorMessage = signal<string>('')

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
          if (err.error.statusCode === 401) {
            this.errorMessage.set('Invalid credentials. ')
          }
          this.isLoading.set(false);
        },
        complete: () => { this.isLoading.set(false); this.form.reset(); },
      })
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
