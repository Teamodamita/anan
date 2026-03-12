import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { AuthUser } from '../../models/auth.model';

@Component({
  selector: 'app-profile-vet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-vet.html',
  styleUrl:    './profile-vet.css'
})
export class ProfileVetComponent implements OnInit {
  authUser: AuthUser | null = null;
  isEditing = false;
  isSaving  = false;
  savedOk   = false;

  editName      = '';
  editNum       = '';
  editLicense   = '';
  editSpecialty = '';

  constructor(
    private readonly authService: AuthService,
    private readonly router:      Router
  ) {}

  ngOnInit(): void {
    this.authUser = this.authService.getSession();
    if (!this.authUser || this.authUser.role !== 'vet') {
      this.router.navigate(['/auth/login']);
      return;
    }
    this.resetEditFields();
  }

  startEdit(): void {
    this.resetEditFields();
    this.isEditing = true;
    this.savedOk   = false;
  }

  cancelEdit(): void { this.isEditing = false; }

  saveChanges(): void {
    if (!this.authUser) return;
    this.isSaving = true;

    this.authService.updateUser(this.authUser.user.user_id, {
      name: this.editName,
      num:  this.editNum
    }).subscribe({
      next: (updatedUser) => {
        if (!this.authUser) return;
        this.authUser.user = updatedUser;

        if (this.authUser.vetProfile) {
          this.authService.updateVetProfile(
            this.authUser.vetProfile.veterinarian_id,
            { license_number: this.editLicense, specialty: this.editSpecialty }
          ).subscribe({
            next: (updatedVet) => {
              if (!this.authUser) return;
              this.authUser.vetProfile = updatedVet;
              this.authService.saveSession(this.authUser);
              this.isSaving  = false;
              this.isEditing = false;
              this.savedOk   = true;
            }
          });
        } else {
          this.authService.saveSession(this.authUser);
          this.isSaving  = false;
          this.isEditing = false;
          this.savedOk   = true;
        }
      },
      error: () => { this.isSaving = false; }
    });
  }

  logout(): void {
    this.authService.clearSession();
    this.router.navigate(['/']);
  }

  private resetEditFields(): void {
    if (!this.authUser) return;
    this.editName      = this.authUser.user.name;
    this.editNum       = this.authUser.user.num;
    this.editLicense   = this.authUser.vetProfile?.license_number ?? '';
    this.editSpecialty = this.authUser.vetProfile?.specialty      ?? '';
  }
}