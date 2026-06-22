import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { NavItem } from '../../../shared/interfaces/navbar.interface';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  readonly  NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    route: 'dashboard',
    icon: 'grid-outline',
  },
  {
    label: 'Messages',
    route: 'company',
    icon: 'chatbubbles-outline',
  },
];
}
