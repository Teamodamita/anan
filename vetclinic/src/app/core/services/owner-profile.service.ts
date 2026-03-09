import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OwnerProfile } from '../models/owner-profile';

@Injectable({ providedIn: 'root' })
export class OwnerProfileService {
  private readonly api = 'http://localhost:3000/ownerProfiles';

  constructor(private http: HttpClient) {}

  getAll(): Observable<OwnerProfile[]> {
    return this.http.get<OwnerProfile[]>(this.api);
  }

  getById(id: number): Observable<OwnerProfile> {
    return this.http.get<OwnerProfile>(`${this.api}/${id}`);
  }

  getByUser(userId: number): Observable<OwnerProfile[]> {
    return this.http.get<OwnerProfile[]>(`${this.api}?user_id=${userId}`);
  }
}