import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { VeterinarianProfile } from '../models/veterinarian-profile';

@Injectable({ providedIn: 'root' })
export class VeterinarianProfileService {
  private readonly api = 'http://localhost:3000/veterinarianProfiles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<VeterinarianProfile[]> {
    return this.http.get<VeterinarianProfile[]>(this.api);
  }

  getById(id: number): Observable<VeterinarianProfile> {
    return this.http.get<VeterinarianProfile>(`${this.api}/${id}`);
  }

  getByUser(userId: number): Observable<VeterinarianProfile[]> {
    return this.http.get<VeterinarianProfile[]>(`${this.api}?user_id=${userId}`);
  }
}