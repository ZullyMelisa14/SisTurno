import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-qr-scanner',
  templateUrl: './qr-scanner.component.html',
  styleUrls: ['./qr-scanner.component.css']
})
export class QrScannerComponent {
  resultadoQR: string = '';
  turnoValido: boolean | null = null;
  datosTurno: any = null;

  constructor(private afs: AngularFirestore) {}

  onCodeResult(result: string) {
    this.resultadoQR = result;
    this.verificarTurno(result);
  }

  verificarTurno(turnoId: string) {
    this.afs.collection('turnos').doc(turnoId).get().subscribe(doc => {
      if (doc.exists) {
        this.turnoValido = true;
        this.datosTurno = doc.data();
      } else {
        this.turnoValido = false;
        this.datosTurno = null;
      }
    });
  }
}
