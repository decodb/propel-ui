import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Output, signal } from '@angular/core';
import { RouterLink } from "@angular/router";
import { IntersectionObserverDirective } from "../../../../../shared/directives/intersection-observer.directive";

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, IntersectionObserverDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent {
  @Output() fileSelected = new EventEmitter<File>();
  showPassword = signal<boolean>(false);

  selectedFile: File | null = null;
  isDragging = false;

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
