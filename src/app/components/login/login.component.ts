import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { EvidenciaService } from '../../services/evidencia.service';
import { ExamService } from '../../services/exam.service';
import { ProgressService } from '../../services/progress.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage: string = '';
  loadingAdmin: boolean = false;
  loadingPreload: boolean = false;
  preloadMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private evidenciaService: EvidenciaService,
    private examService: ExamService,
    private progressService: ProgressService
  ) {}

  ngOnInit(): void {
    // Si ya está logueado, redirigir al dashboard
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    }

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.errorMessage = '';
      const { email, password } = this.loginForm.value;
      
      this.authService.login({ email, password }).subscribe({
        next: () => {
          this.startPreloadingPhase();
        },
        error: (err: any) => {
          this.errorMessage = err.error?.message || 'Error al iniciar sesión. Verifique sus credenciales.';
        }
      });
    } else {
      this.errorMessage = 'Por favor, complete todos los campos requeridos.';
      this.loginForm.markAllAsTouched();
    }
  }

  loginAsAdmin(): void {
    this.loadingAdmin = true;
    this.errorMessage = '';
    this.authService.login({ email: 'krontroth@gmail.com', password: '987987987' }).subscribe({
      next: () => {
        this.startPreloadingPhase();
      },
      error: (err: any) => {
        this.loadingAdmin = false;
        this.errorMessage = err.error?.message || 'Error al ingresar como Administrador. Intente de nuevo.';
      }
    });
  }

  startPreloadingPhase(): void {
    this.loadingPreload = true;
    this.preloadMessage = 'Estableciendo conexión segura...';
    
    const role = this.authService.getRole();
    const requests: Observable<any>[] = [];

    // Todos cargan el progreso didáctico y las evidencias
    requests.push(this.progressService.getProgress());
    requests.push(this.evidenciaService.getEvidencias());

    if (role === 'administrador' || role === 'profesor') {
      requests.push(this.userService.getUsers());
      requests.push(this.examService.getAllResults());
    } else {
      requests.push(this.examService.getUserExams());
    }

    // Cambiar mensajes dinámicos cada cierto tiempo para efecto visual premium
    const messages = [
      'Cargando tu progreso didáctico...',
      'Sincronizando participaciones y evidencias...',
      'Preparando evaluaciones y simuladores...',
      '¡Listo! Redireccionando al panel principal...'
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < messages.length - 1) {
        this.preloadMessage = messages[msgIndex];
        msgIndex++;
      }
    }, 400);

    // Ejecutar todas las peticiones en paralelo
    forkJoin(requests).subscribe({
      next: () => {
        clearInterval(interval);
        this.preloadMessage = '¡Todo listo! Redireccionando...';
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 600);
      },
      error: (err) => {
        clearInterval(interval);
        console.error('Error preloading data:', err);
        // Fail-safe: igual redirigir para no bloquear el login
        this.router.navigate(['/dashboard']);
      }
    });
  }
}
