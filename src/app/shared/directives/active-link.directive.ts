import { Directive, ElementRef, Input, Renderer2, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appActiveLink]',
})
export class ActiveLinkDirective implements OnInit {
  @Input('appActiveLink')
  styles!: { activeStyle: any; inactiveStyle: any };
  @Input() routerLink!: string;

  private routerSubscription!: Subscription; // RxJs Class

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private router: Router
  ) {}

  // Initialized first, router event subscription to update the style of the active link
  ngOnInit(): void {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.updateStyle(event.urlAfterRedirects);
      }
    });
    this.updateStyle(this.router.url);
  }
  // Update the style based on the current URL
  private updateStyle(currentUrl: string): void {
    const isActive = currentUrl.includes(this.routerLink);
    const style = isActive
      ? this.styles.activeStyle
      : this.styles.inactiveStyle;
    this.applyStyle(style);
  }

  // Apply the given styles to the DOM element
  private applyStyle(style: any): void {
    Object.keys(style).forEach((key) => {
      this.renderer.setStyle(this.el.nativeElement, key, style[key]);
    });
  }

  // Remove the subscription when the directive is destroyed
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
}
