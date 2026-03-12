import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { PetService } from '../../../../core/services/pet.service';
import { VeterinarianProfileService } from '../../../../core/services/veterinarian-profile.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../auth/service/auth.service';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment';
import { Pet } from '../../../../core/models/pet';
import { AppointmentStatusPipe } from '../../../../shared/pipes/appointment-status.pipe';
import { PetAgePipe } from '../../../../shared/pipes/pet-age.pipe';
import { SpeciesLabelPipe } from '../../../../shared/pipes/species-label.pipe';
import { StatusBadgeDirective } from '../../../../shared/directives/status-badge.directive';

export interface StatusTransition {
  value: AppointmentStatus;
  label: string;
  icon:  string;
}

@Component({
  selector: 'app-appointment-detail',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentStatusPipe,
    PetAgePipe,
    SpeciesLabelPipe,
    StatusBadgeDirective
  ],
  templateUrl: './appointment-detail.html',
  styleUrl:    './appointment-detail.css'
})
export class AppointmentDetail implements OnInit {
  appointment: Appointment | null = null;
  pet:         Pet | null         = null;
  vetName      = '';
  isLoading    = true;
  isVet        = false;
  isSaving     = false;

  readonly statusTransitions: StatusTransition[] = [
    { value: 'ongoing',   label: 'Iniciar',    icon: 'bi-play-circle'   },
    { value: 'completed', label: 'Completar',  icon: 'bi-check-circle'  },
    { value: 'cancelled', label: 'Cancelar',   icon: 'bi-x-circle'      },
    { value: 'scheduled', label: 'Reprogramar', icon: 'bi-arrow-repeat' }
  ];

  constructor(
    private readonly route:              ActivatedRoute,
    private readonly appointmentService: AppointmentService,
    private readonly petService:         PetService,
    private readonly vetService:         VeterinarianProfileService,
    private readonly userService:        UserService,
    private readonly authService:        AuthService,
    private readonly router:             Router
  ) {}

  ngOnInit(): void {
    const session = this.authService.getSession();
    if (!session) { this.router.navigate(['/auth/login']); return; }

    this.isVet     = session.role === 'vet';
    const id       = Number(this.route.snapshot.paramMap.get('id'));

    this.appointmentService.getById(id).subscribe({
      next: (appt) => {
        this.appointment = appt;
        forkJoin({
          pet:   this.petService.getById(appt.pet_id),
          vets:  this.vetService.getAll(),
          users: this.userService.getAll()
        }).subscribe({
          next: ({ pet, vets, users }) => {
            this.pet         = pet;
            const vetProf    = vets.find((v) => v.veterinarian_id === appt.veterinarian_id);
            const vetUser    = users.find((u) => u.user_id === vetProf?.user_id);
            this.vetName     = vetUser?.name ?? '—';
            this.isLoading   = false;
          },
          error: () => { this.isLoading = false; }
        });
      },
      error: () => { this.isLoading = false; }
    });
  }

  get availableTransitions(): StatusTransition[] {
    if (!this.appointment) return [];
    return this.statusTransitions.filter(
      (t) => t.value !== this.appointment!.status
    );
  }

  changeStatus(status: AppointmentStatus): void {
    if (!this.appointment) return;
    this.isSaving = true;
    this.appointmentService.update(this.appointment.appointment_id, { status }).subscribe({
      next: (updated) => {
        this.appointment = updated;
        this.isSaving    = false;
      },
      error: () => { this.isSaving = false; }
    });
  }

  goBack(): void { this.router.navigate(['/appointments']); }
  goToEdit(): void {
    this.router.navigate(['/appointments/edit', this.appointment?.appointment_id]);
  }
}