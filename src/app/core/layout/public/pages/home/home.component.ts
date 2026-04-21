import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NavbarComponent } from '../../../components/navbar/navbar.component';
import { RouterLink } from "@angular/router";
import { FooterComponent } from "../../../components/footer/footer.component";
import { IntersectionObserverDirective } from "../../../../../shared/directives/intersection-observer.directive";

@Component({
  selector: 'app-home',
  imports: [NavbarComponent, RouterLink, FooterComponent, IntersectionObserverDirective],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  heroSectionElements = {
    h2: false,
    h3: false,
    p1: false,
    a: false,
    div1: false,
    div2: false,
    div3: false,
    div4: false,
    p2: false,
    img: false
  };

  promoteSectionElements = {
    span: false,
    h3: false,
    p: false,
    card1: false,
    card2: false,
    card3: false,
    card4: false,
    card5: false,
    card6: false,
    card7: false
  }

  faqSectionElements = {
    span: false,
    h3: false,
    p: false,
  }

  // HERO SECTION

  onHeroHeaderIntersection(isVisible: boolean) {
    if (isVisible) {
      this.heroSectionElements.h2 = isVisible;

      setTimeout(() => {
        this.heroSectionElements.h3 = isVisible;
      }, 1000);
    }
  }

  onParagraphIntersection(isVisible: boolean) {
    if (isVisible) {
      this.heroSectionElements.p1 = isVisible;
    }
  }

  onButtonIntersect(isVisible: boolean) {
    if (isVisible) {
      this.heroSectionElements.a = isVisible;
    }
  }

  onTeamsIntersect(isVisible: boolean) {
    if (isVisible) {
      setTimeout(() => { this.heroSectionElements.div1 = true; }, 500);
      setTimeout(() => { this.heroSectionElements.div2 = true; }, 1000);
      setTimeout(() => { this.heroSectionElements.div3 = true; }, 1500);
      setTimeout(() => { this.heroSectionElements.div4 = true; }, 2000);
      setTimeout(() => { this.heroSectionElements.p2 = true; }, 2500);
    }
  }

  onImageIntersect(isVisible: boolean) {
    if (isVisible) {
      this.heroSectionElements.img = true;
    }
  }

  // PROMOTE SECTION
  onSpanIntersection (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.span = isVisible
    }
  }

  onH3Intersection (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.h3 = isVisible
    }
  }

  onPIntersection(isVisible: boolean) {
    this.promoteSectionElements.p = isVisible
  }

  onCard1Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card1 = isVisible
    }
  }

  onCard2Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card2 = isVisible
    }
  }

  onCard3Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card3 = isVisible
    }
  }

  onCard4Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card4 = isVisible
    }
  }

  onCard5Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card5 = isVisible
    }
  }

  onCard6Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card6 = isVisible
    }
  }

  onCard7Intersecting (isVisible: boolean) {
    if (isVisible) {
      this.promoteSectionElements.card7 = isVisible
    }
  }

  // faq section
  onFaqSpanIntersection (isVisible: boolean) {
    if (isVisible) {
      this.faqSectionElements.span = isVisible
    }
  }

  onFaqH3Intersection (isVisible: boolean) {
    if (isVisible) {
      this.faqSectionElements.h3 = isVisible
    }
  }

  onFaqPIntersection(isVisible: boolean) {
    this.faqSectionElements.p = isVisible
  }
  
}
