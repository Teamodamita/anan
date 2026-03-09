import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';
import { AppointmentStatus } from '../../core/models/appointment';

// aplica clase Bootstrap badge segun el status de la cita
@Directive({ selector: '[appStatusBadge]', standalone: false })
export class StatusBadgeDirective implements OnInit {
  @Input('appStatusBadge') status: AppointmentStatus = 'scheduled';

  private readonly badgeMap: Record<AppointmentStatus, string> = {
    scheduled: 'bg-primary',
    ongoing: 'bg-warning text-dark',
    cancelled: 'bg-danger',
    completed: 'bg-success'
  };

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnInit(): void {
    const badgeClass = this.badgeMap[this.status] ?? 'bg-secondary';
    this.renderer.addClass(this.el.nativeElement, 'badge');
    badgeClass.split(' ').forEach(cls =>
      this.renderer.addClass(this.el.nativeElement, cls)
    );
  }
}