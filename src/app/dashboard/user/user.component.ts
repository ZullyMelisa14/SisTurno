import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { AuthService } from '../../services/auth.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  eventos: any[] = [];
  turnoGenerado: any = null; // aquí guardaremos el turno para mostrar su QR

  constructor(
    private eventosService: EventosService,
    private auth: AuthService,
    private afs: AngularFirestore
  ) {}

  ngOnInit(): void {
  this.eventosService.obtenerEventos().subscribe(data => {
    this.eventos = data;
  });

  const user = this.auth.getUsuarioActual();
  if (user) {
    // Verificar si el usuario ya tiene un turno
    this.afs.collection('turnos', ref =>
      ref.where('usuarioId', '==', user.uid)
    ).get().subscribe(snapshot => {
      if (!snapshot.empty) {
        const turno = snapshot.docs[0];
        this.turnoGenerado = {
          id: turno.id,
          ...turno.data() as object
        };
      }
    });
  }
  this.cargarTurnosDelUsuario();
}

  solicitarTurno(eventoId: string) {
  const user = this.auth.getUsuarioActual();
  const ahora = new Date();

  if (user) {
    // Verificar si ya tiene turno para este evento
    this.afs.collection('turnos', ref =>
      ref.where('usuarioId', '==', user.uid).where('eventoId', '==', eventoId)
    ).get().subscribe(snapshot => {
      if (!snapshot.empty) {
        alert('⚠️ Ya tienes un turno para este evento.');
      } else {
        // Si no tiene turno, lo crea
        this.afs.collection('turnos').add({
          eventoId,
          usuarioId: user.uid,
          fechaSolicitud: ahora
        }).then(docRef => {
          alert('✅ Turno solicitado con éxito');
          this.turnoGenerado = {
            id: docRef.id,
            eventoId,
            usuarioId: user.uid
          };
        });
      }
    });
  }
}

turnosUsuario: any[] = [];

cargarTurnosDelUsuario() {
  const user = this.auth.getUsuarioActual();
  if (user) {
    this.afs.collection('turnos', ref =>
      ref.where('usuarioId', '==', user.uid)
    ).valueChanges({ idField: 'id' }).subscribe(data => {
      this.turnosUsuario = data;
    });
  }
}

descargarQR() {
  const qrElement = document.querySelector('qrcode canvas') as HTMLCanvasElement;
  if (qrElement) {
    const enlace = document.createElement('a');
    enlace.href = qrElement.toDataURL('image/png');
    enlace.download = `turno-${this.turnoGenerado.id}.png`;
    enlace.click();
  } else {
    alert('⚠️ No se pudo encontrar el código QR');
  }
}

cerrarSesion() {
  this.auth.logout();
}

}
