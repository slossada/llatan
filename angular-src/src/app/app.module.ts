// Modulos
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes} from '@angular/router';
import { FlashMessagesModule } from 'angular2-flash-messages';

// Componentes
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProfileComponent } from './components/profile/profile.component';
import { FooterComponent } from './components/footer/footer.component';
import { FormGuiaComponent } from './components/form-guia/form-guia.component';
import { ListaEventosComponent } from './components/lista-eventos/lista-eventos.component';
import { FormEventosComponent } from './components/form-eventos/form-eventos.component';
import { DetalleEventoComponent } from './components/detalle-evento/detalle-evento.component';
import { AsignarCoordisComponent } from './components/asignar-coordis/asignar-coordis.component';
import { AsignarDirectoresComponent } from './components/asignar-directores/asignar-directores.component';

// Servicios
import { AuthService } from './services/auth.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Pipes
import { DatePipe } from '@angular/common';

const appRoutes: Routes = [
  // Generales
  {path: '', component: HomeComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthGuard]},

  // Guia
  {path: 'form-guia', component: FormGuiaComponent, canActivate: [AuthGuard]},

  // Eventos (Falta autentificar solo encargados o administrador)
  {path: 'form-eventos', component: FormEventosComponent, canActivate: [AuthGuard]},
  {path: 'lista-eventos', component: ListaEventosComponent, canActivate: [AuthGuard]},
  {path: 'detalle-evento', component: DetalleEventoComponent, canActivate: [AuthGuard]},

  // Asignacion
  {path: 'asignar-coordis', component: AsignarCoordisComponent, canActivate: [AuthGuard]},
  {path: 'asignar-directores', component: AsignarDirectoresComponent, canActivate: [AuthGuard]},
]

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ProfileComponent,
    FooterComponent,
    FormGuiaComponent,
    ListaEventosComponent,
    FormEventosComponent,
    DetalleEventoComponent,
    AsignarCoordisComponent,
    AsignarDirectoresComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(appRoutes),
    FlashMessagesModule.forRoot()
  ],
  providers: [AuthService, AuthGuard, DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
