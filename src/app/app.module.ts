import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Auth
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

// Layout
import { LayoutComponent } from './components/layout/layout.component';
import { NavbarComponent } from './components/layout/navbar/navbar.component';

// Pages
import { LandingComponent } from './components/landing/landing.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersListComponent } from './components/dashboard/users-list/users-list.component';
import { ResultsComponent } from './components/dashboard/results/results.component';
import { Sim0IntroduccionComponent } from './components/laboratorio/sim0-introduccion/sim0-introduccion.component';
import { LaboratorioHubComponent } from './components/laboratorio/laboratorio-hub/laboratorio-hub.component';
import { RecursosComponent } from './components/recursos/recursos.component';

// Shared
import { SimulationWrapperComponent } from './shared/simulation-wrapper/simulation-wrapper.component';
import { SimCardComponent } from './shared/sim-card/sim-card.component';
import { InfoPanelComponent } from './shared/info-panel/info-panel.component';

// Simulaciones - Bloque 2: Agroecosistemas
import { Sim6FactoresCultivoComponent } from './components/laboratorio/sim6-factores-cultivo/sim6-factores-cultivo.component';
import { Sim7EscalasProductivasComponent } from './components/laboratorio/sim7-escalas-productivas/sim7-escalas-productivas.component';
import { Sim8ResilienciaAgricolaComponent } from './components/laboratorio/sim8-resiliencia-agricola/sim8-resiliencia-agricola.component';

// Exam
import { ExamComponent } from './components/laboratorio/exam/exam.component';

@NgModule({
  declarations: [
    AppComponent,

    // Auth
    LoginComponent,
    RegisterComponent,

    // Layout
    LayoutComponent,
    NavbarComponent,

    // Pages
    LandingComponent,
    DashboardComponent,
    UsersListComponent,
    ResultsComponent,
    Sim0IntroduccionComponent,
    LaboratorioHubComponent,
    RecursosComponent,

    // Shared
    SimulationWrapperComponent,
    SimCardComponent,
    InfoPanelComponent,

    // Simulaciones - Bloque Agroecosistemas
    Sim6FactoresCultivoComponent,
    Sim7EscalasProductivasComponent,
    Sim8ResilienciaAgricolaComponent,

    // Exam
    ExamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule,
    HttpClientModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
