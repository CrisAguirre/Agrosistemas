import { Component, Input, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';
import { EvidenciaService } from '../../services/evidencia.service';
import { ExamService } from '../../services/exam.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-simulation-wrapper',
  templateUrl: './simulation-wrapper.component.html',
  styleUrls: ['./simulation-wrapper.component.css']
})
export class SimulationWrapperComponent implements OnInit {
  @Input() simTitle: string = '';
  @Input() simDescription: string = '';
  @Input() simNumber: number = 0; // 6: Factores Cultivo, 7: Escalas Productivas, 8: Resiliencia Agrícola
  @Input() lineamientos: string = '';
  @Input() bloque: 'agua' | 'agro' | 'intro' = 'agro';
  @Input() hasApropiacion: boolean = false;

  activeTab: 'apropiacion' | 'actividad' | 'simulador' | 'evaluacion' = 'simulador';
  evalLocked: boolean = false;

  evidenciaText: string = '';
  isEvidenciaSaved: boolean = false;
  isSaving: boolean = false;
  saveMessage: string = '';

  constructor(
    private progressService: ProgressService,
    private evidenciaService: EvidenciaService,
    private examService: ExamService
  ) {}

  ngOnInit() {
    this.checkPrerequisites();
    // Check if evidence already exists for this lab
    this.evidenciaService.getEvidencias().subscribe(evidencias => {
      const existing = evidencias.find(e => e.titulo === `Evidencia ${this.simTitle}`);
      if (existing) {
        this.evidenciaText = existing.contenido;
        this.isEvidenciaSaved = true;
      }
    });
  }

  checkPrerequisites() {
    // Obtenemos evidencias y exámenes del usuario
    forkJoin({
      evidencias: this.evidenciaService.getEvidencias(),
      exams: this.examService.getUserExams()
    }).subscribe(({ evidencias, exams }) => {
      
      const introCompleted = 
        evidencias.some(e => e.titulo.includes('Lluvia de Ideas')) && 
        evidencias.some(e => e.titulo.includes('Síntesis Final'));

      const hasExam = (name: string) => exams.some(e => e.examName === name);

      // Lógica Secuencial de Bloqueo de Evaluación en Agrosistemas:
      if (this.simNumber === 6) {
        // Actividad 1 (Factores del Cultivo) -> Requiere Sesión Introductoria (Intro)
        if (!introCompleted) this.evalLocked = true;
      }
      else if (this.simNumber === 7) {
        // Actividad 2 (Escalas Productivas) -> Requiere Evaluación de Factores del Cultivo
        if (!hasExam('factores-cultivo')) this.evalLocked = true;
      }
      else if (this.simNumber === 8) {
        // Actividad 3 (Resiliencia Agrícola) -> Requiere Evaluación de Escalas Productivas
        if (!hasExam('escalas-productivas')) this.evalLocked = true;
      }
    });
  }

  setTab(tab: 'apropiacion' | 'actividad' | 'simulador' | 'evaluacion') {
    if (tab === 'evaluacion' && this.evalLocked) {
      alert('🔒 Esta evaluación está bloqueada. Debes completar las actividades y evaluaciones de las sesiones anteriores para desbloquearla.');
      return;
    }
    this.activeTab = tab;
  }

  saveEvidencia() {
    if (!this.evidenciaText.trim() || this.isSaving) return;
    this.isSaving = true;
    
    this.evidenciaService.saveTextEvidencia({
      titulo: `Evidencia ${this.simTitle}`,
      contenido: this.evidenciaText
    }).subscribe({
      next: () => {
        this.isEvidenciaSaved = true;
        this.isSaving = false;
        this.saveMessage = '✅ Evidencia guardada exitosamente';
        setTimeout(() => this.saveMessage = '', 3000);
      },
      error: () => {
        this.isSaving = false;
        this.saveMessage = '❌ Error al guardar la evidencia';
        setTimeout(() => this.saveMessage = '', 3000);
      }
    });
  }
}
