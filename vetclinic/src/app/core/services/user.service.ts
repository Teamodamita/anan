import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly api = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(this.api);
  }

  getById(id: number): Observable<User> {
    return this.http.get<User>(`${this.api}/${id}`);
  }

  create(usuario: Omit<User, 'user_id'>): Observable<User> {
    return this.http.post<User>(this.api, usuario);
  }

  update(id: number, usuario: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.api}/${id}`, usuario);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}