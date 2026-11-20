import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;
  private usersCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    if (this.usersCache) {
      return of(this.usersCache);
    }
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(users => this.usersCache = users)
    );
  }

  clearCache(): void {
    this.usersCache = null;
  }
}
