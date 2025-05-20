import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { UserComponent } from './dashboard/user/user.component';
import { QrScannerComponent } from './dashboard/qr-scanner/qr-scanner.component';
import { TurnosEventoComponent } from './dashboard/turnos-evento/turnos-evento.component';
import { GestionUsuariosComponent } from './dashboard/gestion-usuarios/gestion-usuarios.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'admin/usuarios', component: GestionUsuariosComponent },
  { path: 'admin/scan', component: QrScannerComponent },
  { path: 'admin/eventos/:id/turnos', component: TurnosEventoComponent },
  { path: 'user', component: UserComponent },
  { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
