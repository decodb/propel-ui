import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../../shared/directives/intersection-observer.directive";

@Component({
  selector: 'app-sign-in',
  imports: [RouterLink, IntersectionObserverDirective],
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
