import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { AbstractControl, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators} from '@angular/forms';
import { IntersectionObserverDirective } from '../../../../shared/directives/intersection-observer.directive';


@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, IntersectionObserverDirective, ReactiveFormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  @Output() fileSelected = new EventEmitter<File>();
  showPassword = signal<boolean>(false);

  selectedFile: File | null = null;
  isDragging = false;

  registrationForm = new FormGroup({
    company: new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100),
      ]),
      industry: new FormControl('', [
        Validators.required,
      ]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\+?[\d\s\-().]{7,15}$/),
      ]),
      website: new FormControl('', [
        Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/),
      ]),
    }),

    admin: new FormGroup({
      firstName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/),
      ]),
      confirmPassword: new FormControl('', [
        Validators.required,
      ]),
    }, { validators: this.passwordMatchValidator }),
  });

  // check if passwords match
  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  // check if a field has an error
  hasError(path: string | string[], error: string): boolean {
    const control = this.registrationForm.get(path);
    return !!control && control.hasError(error) && (control.dirty || control.touched);
  }

  onSubmit() {
    //console.log(this.registrationForm.value)
    console.log(this.selectedFile)
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) this.setFile(input.files[0]);
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }
  
  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files[0];
    if (file) this.setFile(file);
  }

  removeFile(event: MouseEvent): void {
    event.stopPropagation();
    this.selectedFile = null;
  }

  private setFile(file: File): void {
    this.selectedFile = file;
    this.fileSelected.emit(file);
  }

  togglePassword() {
    this.showPassword.set(!this.showPassword())
  }

  // Intersection Observer
  companyFields = {
    name: false,
    industry: false,
    phone: false,
    website: false,
    image: false
  }

  adminDetails = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirmPassword: false
  }

  onCompanyDetailsIntersection(isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.companyFields.name = true; }, 500);
      setTimeout(() => { this.companyFields.industry = true; }, 1000);
      setTimeout(() => { this.companyFields.phone = true; }, 1500);
      setTimeout(() => { this.companyFields.website = true; }, 2000);
      setTimeout(() => { this.companyFields.image = true; }, 2500);
    }
  }

  onAdminDetailsIntersection(isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.adminDetails.firstName = true; }, 500);
      setTimeout(() => { this.adminDetails.lastName = true; }, 1000);
      setTimeout(() => { this.adminDetails.email = true; }, 1500);
      setTimeout(() => { this.adminDetails.password = true; }, 2000);
      setTimeout(() => { this.adminDetails.confirmPassword = true; }, 2500);
    }
  }
}
