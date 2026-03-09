import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppointmentStatusPipe } from './pipes/appointment-status.pipe';
import { PetAgePipe } from './pipes/pet-age.pipe';
import { SpeciesLabelPipe } from './pipes/species-label.pipe';
import { HighlightUpcomingDirective } from './directives/highlight-upcoming.directive';
import { StatusBadgeDirective } from './directives/status-badge.directive';

@NgModule({
  declarations: [
    AppointmentStatusPipe,
    PetAgePipe,
    SpeciesLabelPipe,
    HighlightUpcomingDirective,
    StatusBadgeDirective
  ],
  imports: [CommonModule],
  exports: [
    AppointmentStatusPipe,
    PetAgePipe,
    SpeciesLabelPipe,
    HighlightUpcomingDirective,
    StatusBadgeDirective
  ]
})
export class SharedModule {}