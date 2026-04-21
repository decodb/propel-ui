import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appIntersectionObserver]'
})
export class IntersectionObserverDirective implements OnInit, OnDestroy {

  @Input() root: Element | null = null;
  @Input() rootMargin: string = '0px';
  @Input() threshold: number | number[] = 0;

  @Output() intersecting = new EventEmitter<boolean>();

  private observer!: IntersectionObserver;

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.observer = new IntersectionObserver(
      ([entry]) => {
        this.intersecting.emit(entry.isIntersecting);
      },
      {
        root: this.root,
        rootMargin: this.rootMargin,
        threshold: this.threshold
      }
    );

    this.observer.observe(this.el.nativeElement);
  }

  ngOnDestroy() {
    this.observer.disconnect();
  }

}
