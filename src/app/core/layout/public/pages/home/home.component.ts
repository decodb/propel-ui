import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { RouterLink } from "@angular/router";
import { FooterComponent } from "../../../components/footer/footer.component";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterLink, FooterComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
