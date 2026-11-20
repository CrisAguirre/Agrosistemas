import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EvidenciaService {
  private apiUrl = `${environment.apiUrl}/evidencias`;
  private evidenciasCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getEvidencias(): Observable<any[]> {
    if (this.evidenciasCache) {
      return of(this.evidenciasCache);
    }
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(ev => this.evidenciasCache = ev)
    );
  }

  uploadEvidencia(formData: FormData): Observable<any> {
    return this.http.post<any>(this.apiUrl, formData).pipe(
      tap(ev => {
        if (this.evidenciasCache) {
          this.evidenciasCache.unshift(ev);
        }
      })
    );
  }

  saveTextEvidencia(data: { titulo: string, contenido: string, tipoArchivo?: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/texto`, data).pipe(
      tap(ev => {
        if (this.evidenciasCache) {
          this.evidenciasCache.unshift(ev);
        }
      })
    );
  }

  clearCache(): void {
    this.evidenciasCache = null;
  }
}
