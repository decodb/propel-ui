import { Component, CUSTOM_ELEMENTS_SCHEMA, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IntersectionObserverDirective } from "../../../../shared/directives/intersection-observer.directive";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
    console.log(this.form.value)
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
