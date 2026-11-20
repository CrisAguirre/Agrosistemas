import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProgressService {
  private apiUrl = `${environment.apiUrl}/progress`;
  private progressCache: any | null = null;

  constructor(private http: HttpClient) {}

  getProgress(): Observable<any> {
    if (this.progressCache) {
      return of(this.progressCache);
    }
    return this.http.get<any>(this.apiUrl).pipe(
      tap(prog => this.progressCache = prog)
    );
  }

  updateProgress(progressData: { 
    currentSimulationId?: number, 
    simulationData?: any, 
    completedSimulation?: number 
  }): Observable<any> {
    return this.http.put<any>(this.apiUrl, progressData).pipe(
      tap(prog => this.progressCache = prog)
    );
  }

  clearCache(): void {
    this.progressCache = null;
  }
}
