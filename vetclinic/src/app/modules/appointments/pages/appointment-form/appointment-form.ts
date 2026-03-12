import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AppointmentService } from '../../../../core/services/appointment.service';
import { PetService } from '../../../../core/services/pet.service';
import { VeterinarianProfileService } from '../../../../core/services/veterinarian-profile.service';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../auth/service/auth.service';
import { Appointment } from '../../../../core/models/appointment';
import { Pet } from '../../../../core/models/pet';


export interface VetOption {
  veterinarian_id: number;
  name:            string;
  specialty:       string;
}

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './appointment-form.html',
  styleUrl:    './appointment-form.css'
})
export class AppointmentForm implements OnInit {
  isEditMode   = false;
  isLoading    = true;
  isSaving     = false;
  errorMessage = '';
  appointmentId: number | null = null;

  petId:           number = 0;
  veterinarianId:  number = 0;
  datetime:        string = '';
  durationMinutes: number = 30;
  reason:          string = '';

  pets:       Pet[]       = [];
  vetOptions: VetOption[] = [];

  readonly durationOptions = [15, 30, 45, 60, 90];

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

  if (session.role !== 'vet') {
    this.router.navigate(['/appointments']);
    return;
  }
    const petIdParam = this.route.snapshot.queryParamMap.get('pet_id');
    if (petIdParam) this.petId = Number(petIdParam);

forkJoin({
  pets:  this.petService.getAll(),
  vets:  this.vetService.getAll(),
  users: this.userService.getAll()
}).subscribe({
  next: ({ pets, vets, users }) => {
    this.pets       = pets;
    this.vetOptions = vets.map((v) => {
      const u = users.find((u) => u.user_id === v.user_id);
      return {
        veterinarian_id: v.veterinarian_id,
        name:            u?.name ?? '—',
        specialty:       v.specialty
      };
    });

    this.veterinarianId = session.vetProfile!.veterinarian_id;
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.isEditMode    = true;
          this.appointmentId = Number(id);
          this.appointmentService.getById(this.appointmentId).subscribe({
            next: (appt) => {
              this.petId           = appt.pet_id;
              this.veterinarianId  = appt.veterinarian_id;
              this.datetime        = appt.datetime.slice(0, 16);
              this.durationMinutes = appt.duration_minutes;
              this.reason          = appt.reason;
              this.isLoading       = false;
            },
            error: () => { this.isLoading = false; }
          });
        } else {
          this.isLoading = false;
        }
      },
      error: () => { this.isLoading = false; }
    });
  }

  onSubmit(): void {
    if (!this.petId || !this.veterinarianId || !this.datetime || !this.reason) {
      this.errorMessage = 'Por favor completa todos los campos.';
      return;
    }

    this.isSaving     = true;
    this.errorMessage = '';

    const payload: Omit<Appointment, 'appointment_id'> = {
      pet_id:           this.petId,
      veterinarian_id:  this.veterinarianId,
      datetime:         this.datetime,
      duration_minutes: this.durationMinutes,
      status:           'scheduled',
      reason:           this.reason
    };

    if (this.isEditMode && this.appointmentId) {
      this.appointmentService.update(this.appointmentId, payload).subscribe({
        next:  () => this.router.navigate(['/appointments', this.appointmentId]),
        error: () => { this.isSaving = false; this.errorMessage = 'Error al actualizar.'; }
      });
    } else {
      this.appointmentService.create(payload).subscribe({
        next:  (appt) => this.router.navigate(['/appointments', appt.appointment_id]),
        error: ()     => { this.isSaving = false; this.errorMessage = 'Error al crear.'; }
      });
    }
  }

  goBack(): void { this.router.navigate(['/appointments']); }
}