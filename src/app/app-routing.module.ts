import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Importa los componentes necesarios
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AdminComponent } from './dashboard/admin/admin.component';
import { UserComponent } from './dashboard/user/user.component';
import { QrScannerComponent } from './dashboard/qr-scanner/qr-scanner.component';
import { TurnosEventoComponent } from './dashboard/turnos-evento/turnos-evento.component';
const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },  // redirige a /login por defecto
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'user', component: UserComponent },
  { path: '**', redirectTo: 'login' },  // ruta por defecto en caso de error
  { path: 'admin/scan', component: QrScannerComponent },
  { path: 'admin/eventos/:id/turnos', component: TurnosEventoComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
