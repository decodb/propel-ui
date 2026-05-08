import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../../shared/directives/intersection-observer.directive";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, IntersectionObserverDirective, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  showPassword = signal<boolean>(false);
  forgotPasswordField = {
    email: false
  }

  form = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email,
    ]),
  })

  // check if a field has an error
  hasError(path: string | string[], error: string): boolean {
    const control = this.form.get(path);
    return !!control && control.hasError(error) && (control.dirty || control.touched);
  }

  onSubmit() {
    console.log(this.form.value)
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword())
  }

  onForgotPasswordFormIntersection (isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.forgotPasswordField.email = true; }, 500)
    }
  }
}
