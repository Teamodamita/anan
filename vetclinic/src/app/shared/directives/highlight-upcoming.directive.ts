import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

// resalta visualmente citas que ocurren en las proximas 24 horas
@Directive({ selector: '[appHighlightUpcoming]', standalone: false })
export class HighlightUpcomingDirective implements OnInit {
  @Input('appHighlightUpcoming') datetime: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    if (!this.datetime) return;

    const appointmentDate = new Date(this.datetime);
    const now = new Date();
    const diffMs = appointmentDate.getTime() - now.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours > 0 && diffHours <= 24) {
      this.renderer.addClass(this.el.nativeElement, 'upcoming-highlight');
    }
  }
}