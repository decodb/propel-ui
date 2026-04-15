import { Component, CUSTOM_ELEMENTS_SCHEMA, HostListener, signal } from '@angular/core';

@Component({
  selector: 'app-navbar',
  imports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isScrolled = signal<boolean>(false)

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 50); 
  }
}
