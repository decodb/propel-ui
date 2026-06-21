import { Component, CUSTOM_ELEMENTS_SCHEMA, ElementRef, EventEmitter, HostListener, Output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormGroup, FormControl, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { IntersectionObserverDirective } from '../../../../shared/directives/intersection-observer.directive';
import { CreateRegistrationDto } from '../../auth.model';
import { AuthService } from '../../auth.service';
import { ResetDialogState, ServerErrorDialogComponent } from '../../../../shared/components/server-error-dialog/server-error-dialog.component';

interface IndustryOption {
  value: 'TECHNOLOGY' | 'HEALTHCARE' | 'FINANCE' | 'EDUCATION' | 'MANUFACTURING';
  label: string;
}

@Component({
  selector: 'app-sign-up',
  imports: [RouterLink, IntersectionObserverDirective, ReactiveFormsModule, ServerErrorDialogComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss',
})
export class SignUpComponent {
  // File
  @Output() fileSelected = new EventEmitter<File>();
  selectedFile: File | null = null;
  isDragging = false;

    // ── Dialog ──────────────────────────────────────────────────────────────────
    dialogVisible = false;
    dialogState: ResetDialogState = 'server_error';

  // UI state
  isSubmitted    = signal(false);
  isLoading      = signal(false);
  isDialogOpen   = signal(false);
  showPassword   = signal(false);
  errorMessage   = signal('');
  userEmail      = signal('');

  // Animation visibility
  companyFields = { name: false, industry: false, phone: false, website: false, image: false };
  adminDetails  = { firstName: false, lastName: false, email: false, password: false, confirmPassword: false };

  // ── Industry dropdown ───────────────────────────────────────────────────────
  isIndustryOpen = false;
  industryFocusedIndex = -1;

  industryOptions: IndustryOption[] = [
    { value: 'TECHNOLOGY',     label: 'Technology' },
    { value: 'HEALTHCARE',     label: 'Healthcare' },
    { value: 'FINANCE',        label: 'Finance' },
    { value: 'EDUCATION',      label: 'Education' },
    { value: 'MANUFACTURING',  label: 'Manufacturing' },
  ];

  registrationForm = new FormGroup({
    company: new FormGroup({
      name:     new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]),
      industry: new FormControl('', [Validators.required]),
      phone:    new FormControl('', [Validators.required, Validators.pattern(/^\+?[\d\s\-().]{7,15}$/)]),
      website:  new FormControl('', [Validators.pattern(/^(https?:\/\/)?([\w\-]+\.)+[\w]{2,}(\/.*)?$/)]),
    }),
    admin: new FormGroup({
      firstName:       new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      lastName:        new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
      email:           new FormControl('', [Validators.required, Validators.email]),
      password:        new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)]),
      confirmPassword: new FormControl('', [Validators.required]),
    }, { validators: this.passwordMatchValidator }),
  });

  constructor(private authService: AuthService, private elementRef: ElementRef) {}

  // ─── Form ────────────────────────────────────────────────────────────────

  onSubmit() {
    this.isSubmitted.set(true);
    if (this.registrationForm.invalid || !this.selectedFile) return;

    this.isLoading.set(true);
    this.authService.signUp(this.buildFormData()).subscribe({
      next: (response) => { this.userEmail.set(response.email); this.isDialogOpen.set(true); },
      error: (err: HttpErrorResponse) => {
        if (err.error.statusCode === 409) {
            this.errorMessage.set('Email already exists. Please try with a different email. ')
        } else {
          this.dialogState = 'server_error';
          this.dialogVisible = true;
        }
        this.isLoading.set(false); 
      },
      complete: () => { this.isLoading.set(false); this.registrationForm.reset(); },
    });
  }

  hasError(path: string | string[], error: string): boolean {
    const control = this.registrationForm.get(path);
    return !!control && control.hasError(error) && (control.dirty || control.touched || this.isSubmitted());
  }

  passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password        = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRetry(): void {
    // Form values are preserved so the user can resubmit immediately
    this.dialogVisible = false;
  }

  private buildFormData(): FormData {
    const { firstName, lastName, email, password } = this.registrationForm.controls.admin.controls;
    const { name, industry, website, phone }       = this.registrationForm.controls.company.controls;

    const formData = new FormData();
    formData.append('user[firstName]', firstName.value!);
    formData.append('user[lastName]',  lastName.value!);
    formData.append('user[email]',     email.value!.toLowerCase());
    formData.append('user[password]',  password.value!);
    formData.append('company[name]',   name.value!);
    formData.append('company[industry]', industry.value!);
    formData.append('company[phone]',    phone.value!);
    if (website.value) formData.append('company[website]', website.value);
    formData.append('file', this.selectedFile!);

    return formData;
  }

  // ─── Dialog ──────────────────────────────────────────────────────────────

  onCloseDialog() {
    this.isDialogOpen.set(false);
  }

  // ─── File ────────────────────────────────────────────────────────────────

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

  // ─── UI helpers ──────────────────────────────────────────────────────────

  togglePassword() {
    this.showPassword.update(v => !v);
  }

  // ─── Industry dropdown ───────────────────────────────────────────────────

  get selectedIndustry(): IndustryOption | null {
    const value = this.registrationForm.get(['company', 'industry'])?.value;
    return this.industryOptions.find(o => o.value === value) ?? null;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isIndustryOpen && !this.elementRef.nativeElement.contains(event.target)) {
      this.closeIndustryDropdown();
    }
  }

  toggleIndustryDropdown(): void {
    this.isIndustryOpen ? this.closeIndustryDropdown() : this.openIndustryDropdown();
  }

  openIndustryDropdown(): void {
    this.isIndustryOpen = true;
    const current = this.selectedIndustry;
    this.industryFocusedIndex = current
      ? this.industryOptions.findIndex(o => o.value === current.value)
      : 0;
  }

  closeIndustryDropdown(): void {
    this.isIndustryOpen = false;
    this.registrationForm.get(['company', 'industry'])?.markAsTouched();
  }

  selectIndustry(option: IndustryOption, event?: MouseEvent): void {
    event?.stopPropagation();
    this.registrationForm.get(['company', 'industry'])?.setValue(option.value);
    this.closeIndustryDropdown();
  }

  onIndustryKeydown(event: KeyboardEvent): void {
    if (!this.isIndustryOpen) {
      if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowDown') {
        event.preventDefault();
        this.openIndustryDropdown();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.industryFocusedIndex = Math.min(this.industryFocusedIndex + 1, this.industryOptions.length - 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.industryFocusedIndex = Math.max(this.industryFocusedIndex - 1, 0);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (this.industryFocusedIndex >= 0) this.selectIndustry(this.industryOptions[this.industryFocusedIndex]);
        break;
      case 'Escape':
        event.preventDefault();
        this.closeIndustryDropdown();
        break;
      case 'Tab':
        this.closeIndustryDropdown();
        break;
    }
  }

  // ─── Intersection Observer ───────────────────────────────────────────────

  onCompanyDetailsIntersection(isVisible: boolean) {
    if (!isVisible) return;
    const keys = Object.keys(this.companyFields) as (keyof typeof this.companyFields)[];
    keys.forEach((key, i) => setTimeout(() => { this.companyFields[key] = true; }, (i + 1) * 500));
  }

  onAdminDetailsIntersection(isVisible: boolean) {
    if (!isVisible) return;
    const keys = Object.keys(this.adminDetails) as (keyof typeof this.adminDetails)[];
    keys.forEach((key, i) => setTimeout(() => { this.adminDetails[key] = true; }, (i + 1) * 500));
  }
}