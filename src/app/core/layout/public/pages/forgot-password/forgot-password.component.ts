import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../../shared/directives/intersection-observer.directive";

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, IntersectionObserverDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  showPassword = signal<boolean>(false);
  forgotPasswordField = {
    email: false
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
