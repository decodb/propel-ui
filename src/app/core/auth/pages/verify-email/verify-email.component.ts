import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-verify-email',
  imports: [],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss'
})
export class VerifyEmailComponent {
  status = signal<'loading' | 'success' | 'error'>('loading');

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.status.set('error');
      return;
    }

    this.authService.verifyEmail(token).subscribe({
      next: (response) => {
        this.status.set('success');
        console.log(response);
      },
      error: (err: HttpErrorResponse) => {
        this.status.set('error');
        console.log(err)
      },
    });
  }
}
