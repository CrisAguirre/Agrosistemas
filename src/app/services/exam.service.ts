import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

export interface Question {
  id: string;
  type: 'theory' | 'practice';
  subtype: 'single' | 'multiple';
  text: string;
  options: string[];
  correctAnswers: string[]; // Can be 1 or 2 correct answers
  timeLimit: number; // In seconds (90 or 180)
}

export interface ExamData {
  examName: string;
  questions: Question[];
}

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  private apiUrl = `${environment.apiUrl}/exams`;
  private userExamsCache: any[] | null = null;
  private allResultsCache: any[] | null = null;

  constructor(private http: HttpClient) {}

  getExamQuestions(examName: string): Observable<ExamData> {
    // Para la prueba, cargamos un JSON estático desde assets
    return this.http.get<ExamData>(`/assets/data/exams/${examName}.json`);
  }

  submitExam(examData: { examName: string, score: number, answers: any[] }): Observable<any> {
    return this.http.post<any>(this.apiUrl, examData).pipe(
      tap(exam => {
        if (this.userExamsCache) {
          this.userExamsCache.unshift(exam);
        }
        if (this.allResultsCache) {
          this.allResultsCache.unshift(exam);
        }
      })
    );
  }

  getUserExams(): Observable<any[]> {
    if (this.userExamsCache) {
      return of(this.userExamsCache);
    }
    return this.http.get<any[]>(this.apiUrl).pipe(
      tap(exams => this.userExamsCache = exams)
    );
  }

  getAllResults(): Observable<any[]> {
    if (this.allResultsCache) {
      return of(this.allResultsCache);
    }
    return this.http.get<any[]>(`${this.apiUrl}/all`).pipe(
      tap(results => this.allResultsCache = results)
    );
  }

  clearCache(): void {
    this.userExamsCache = null;
    this.allResultsCache = null;
  }
}
