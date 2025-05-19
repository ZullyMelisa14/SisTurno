import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin/admin.component';
import { UserComponent } from './user/user.component';
import { FormsModule } from '@angular/forms'; // ✅ Importar esto
import { QRCodeModule } from 'angularx-qrcode';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { TurnosEventoComponent } from './turnos-evento/turnos-evento.component';
import { RouterModule } from '@angular/router';
@NgModule({
  declarations: [
    AdminComponent,
    UserComponent,
    QrScannerComponent,
    TurnosEventoComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    QRCodeModule,
    ZXingScannerModule
  ]
})
export class DashboardModule { }
