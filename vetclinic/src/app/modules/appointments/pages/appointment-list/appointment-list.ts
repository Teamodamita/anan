import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { PetService } from '../../../../core/services/pet.service';
import { VeterinarianProfileService } from '../../../../core/services/veterinarian-profile.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../auth/service/auth.service';
import { Appointment, AppointmentStatus } from '../../../../core/models/appointment';
import { AppointmentStatusPipe } from '../../../../shared/pipes/appointment-status.pipe';
import { HighlightUpcomingDirective } from '../../../../shared/directives/highlight-upcoming.directive';
import { StatusBadgeDirective } from '../../../../shared/directives/status-badge.directive';

export interface AppointmentRow {
  appointment: Appointment;
  petName:     string;
  vetName:     string;
}

@Component({
  selector: 'app-appointment-list',
  standalone: true,
  imports: [
    CommonModule,
    AppointmentStatusPipe,
    HighlightUpcomingDirective,
    StatusBadgeDirective
  ],
  templateUrl: './appointment-list.html',
  styleUrl:    './appointment-list.css'
})
export class AppointmentList implements OnInit {
  rows:      AppointmentRow[] = [];
  isLoading = true;
  isVet     = false;

  
  

  activeFilter: AppointmentStatus | 'all' = 'all';

  readonly filters: { value: AppointmentStatus | 'all'; label: string }[] = [
    { value: 'all',       label: 'Todas'      },
    { value: 'scheduled', label: 'Programadas' },
    { value: 'ongoing',   label: 'En curso'    },
    { value: 'completed', label: 'Completadas' },
    { value: 'cancelled', label: 'Canceladas'  }
  ];

  constructor(
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

    this.isVet = session.role === 'vet';

    const appts$ = this.isVet
      ? this.appointmentService.getByVet(session.vetProfile!.veterinarian_id)
      : this.appointmentService.getAll();

    forkJoin({
      appointments: appts$,
      pets:         this.petService.getAll(),
      vets:         this.vetService.getAll(),
      users:        this.userService.getAll()
    }).subscribe({
      next: ({ appointments, pets, vets, users }) => {
        this.rows = appointments.map((appt) => {
          const pet     = pets.find((p) => p.pet_id === appt.pet_id);
          const vetProf = vets.find((v) => v.veterinarian_id === appt.veterinarian_id);
          const vetUser = users.find((u) => u.user_id === vetProf?.user_id);
          return {
            appointment: appt,
            petName:     pet?.name      ?? '—',
            vetName:     vetUser?.name  ?? '—'
          };
        });
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  get filteredRows(): AppointmentRow[] {
    if (this.activeFilter === 'all') return this.rows;
    return this.rows.filter((r) => r.appointment.status === this.activeFilter);
  }

  setFilter(f: AppointmentStatus | 'all'): void {
    this.activeFilter = f;
  }

  goToDetail(id: number): void { this.router.navigate(['/appointments', id]); }
  goToNew(): void              { this.router.navigate(['/appointments/new']); }
}