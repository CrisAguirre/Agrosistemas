import { Component, OnInit } from '@angular/core';
import { ProgressService } from '../../services/progress.service';

interface Session {
  number: number;
  title: string;
  subtitle: string;
  duration: string;
  simulations: string;
  lineamientos: string;
  status: 'completed' | 'available' | 'locked';
  route: string;
  simId: number;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  sessions: Session[] = [
    {
      number: 1,
      title: 'Momento de Inicio: Introducción Sistémica',
      subtitle: 'Justificación pedagógica y pensamiento sistémico',
      duration: '45 min',
      simulations: 'Video + Lluvia de Ideas + Apropiación',
      lineamientos: 'Pensamiento Sistémico',
      status: 'available',
      route: '/laboratorio/introduccion',
      simId: 0
    },
    {
      number: 2,
      title: 'Actividad 1: Análisis del Sistema',
      subtitle: 'Interacciones bióticas y abióticas en el cultivo',
      duration: '90 min',
      simulations: 'Sim 6 (Factores del Cultivo)',
      lineamientos: 'Lineamientos 1 y 2: Causalidad y Componentes',
      status: 'locked',
      route: '/laboratorio/factores-cultivo',
      simId: 6
    },
    {
      number: 3,
      title: 'Actividad 2: Síntesis del Sistema',
      subtitle: 'Escalas productivas, balance hídrico y nutrientes',
      duration: '90 min',
      simulations: 'Sim 7 (Escalas Productivas)',
      lineamientos: 'Lineamiento 3: Escalas y Proporciones',
      status: 'locked',
      route: '/laboratorio/escalas-productivas',
      simId: 7
    },
    {
      number: 4,
      title: 'Actividad 3: Implementación y Resiliencia',
      subtitle: 'Toma de decisiones ante crisis climáticas y plagas',
      duration: '120 min',
      simulations: 'Sim 8 (Resiliencia Agrícola) + Evaluación',
      lineamientos: 'Lineamientos 5, 6 y 7: Estabilidad y Totalidad',
      status: 'locked',
      route: '/laboratorio/resiliencia-agricola',
      simId: 8
    }
  ];

  completedCount = 0;
  totalSessions = 4;

  constructor(private progressService: ProgressService) {}

  ngOnInit(): void {
    this.loadProgress();
  }

  loadProgress(): void {
    this.progressService.getProgress().subscribe({
      next: (progress) => {
        const completed = progress.completedSimulations || [];
        let currentId = progress.currentSimulationId || 1;
        if (currentId === 0) currentId = 1;

        this.sessions = this.sessions.map(session => {
          if (completed.includes(session.number)) {
            return { ...session, status: 'completed' };
          } else if (session.number === currentId) {
            return { ...session, status: 'available' };
          } else if (session.number < currentId) {
            return { ...session, status: 'completed' };
          } else {
            return { ...session, status: 'locked' };
          }
        });

        this.completedCount = this.sessions.filter(s => s.status === 'completed').length;
      },
      error: (err) => console.error('Error loading progress:', err)
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'completed': return '✅ Completada';
      case 'available': return '▶️ Disponible';
      case 'locked': return '🔒 Bloqueada';
      default: return '';
    }
  }

  get progressPercent(): number {
    return Math.round((this.completedCount / this.totalSessions) * 100);
  }
}
