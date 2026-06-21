import { animate, style, transition, trigger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges } from '@angular/core';

export type ResetDialogState = 'server_error';

@Component({
  selector: 'app-server-error-dialog',
  imports: [CommonModule],
  templateUrl: './server-error-dialog.component.html',
  styleUrl: './server-error-dialog.component.scss',
  animations: [
    trigger('backdropIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('160ms ease', style({ opacity: 0 })),
      ]),
    ]),
    trigger('dialogIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.94) translateY(12px)' }),
        animate('280ms cubic-bezier(0.16,1,0.3,1)',
          style({ opacity: 1, transform: 'scale(1) translateY(0)' })),
      ]),
      transition(':leave', [
        animate('180ms ease',
          style({ opacity: 0, transform: 'scale(0.96) translateY(8px)' })),
      ]),
    ]),
    trigger('stateIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('300ms cubic-bezier(0.16,1,0.3,1)',
          style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ServerErrorDialogComponent implements OnChanges, OnDestroy {

  @Input() visible = false;
  @Input() state: ResetDialogState = 'server_error';

  @Output() closed = new EventEmitter<void>();
  @Output() retryRequested = new EventEmitter<void>();

  shaking = false;

  private timers: ReturnType<typeof setTimeout>[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['state']) {
      this.onStateChange(this.state);
    }

    if (changes['visible']?.currentValue === false) {
      this.clearTimers();
    }
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private onStateChange(s: ResetDialogState): void {
    this.clearTimers();

    if (s === 'server_error') {
      this.triggerShake();
    }
  }

  close(): void {
    this.closed.emit();
  }

  retry(): void {
    this.retryRequested.emit();
    this.close();
  }

  onBackdropClick(e: MouseEvent): void {
    if ((e.target as HTMLElement).classList.contains('dialog-backdrop')) {
      this.close();
    }
  }

  private triggerShake(): void {
    this.shaking = true;
    this.after(480, () => (this.shaking = false));
  }

  private after(ms: number, fn: () => void): void {
    this.timers.push(setTimeout(fn, ms));
  }

  private clearTimers(): void {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }
}
