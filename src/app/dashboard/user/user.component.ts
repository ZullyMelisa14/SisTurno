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
  turnoGenerado: any = null;
  turnosUsuario: any[] = [];
  eventoSeleccionado: any = null;
  nombreUsuario: string = '';
  cedulaUsuario: string = '';
  turnoSeleccionado: any = null;

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

  mostrarFormulario(evento: any) {
    this.eventoSeleccionado = evento;
    this.nombreUsuario = '';
    this.cedulaUsuario = '';
  }

  cancelarFormulario() {
    this.eventoSeleccionado = null;
    this.nombreUsuario = '';
    this.cedulaUsuario = '';
  }

  enviarTurno() {
    const user = this.auth.getUsuarioActual();
    const ahora = new Date();

    if (!this.nombreUsuario || !this.cedulaUsuario) {
      alert('⚠️ Por favor completa todos los campos');
      return;
    }

    if (user && this.eventoSeleccionado) {
      this.afs.collection('turnos', ref =>
        ref.where('usuarioId', '==', user.uid)
           .where('eventoId', '==', this.eventoSeleccionado.id)
      ).get().subscribe(snapshot => {
        if (!snapshot.empty) {
          alert('⚠️ Ya tienes un turno para este evento.');
        } else {
          this.afs.collection('turnos').add({
            eventoId: this.eventoSeleccionado.id,
            usuarioId: user.uid,
            nombre: this.nombreUsuario,
            cedula: this.cedulaUsuario,
            fechaSolicitud: ahora
          }).then(docRef => {
            alert('✅ Turno solicitado con éxito');
            this.turnoGenerado = {
              id: docRef.id,
              eventoId: this.eventoSeleccionado.id,
              usuarioId: user.uid,
              nombre: this.nombreUsuario,
              cedula: this.cedulaUsuario
            };
            this.cancelarFormulario();
            this.cargarTurnosDelUsuario();
          });
        }
      });
    }
  }

 cargarTurnosDelUsuario() {
  const user = this.auth.getUsuarioActual();
  if (user) {
    this.afs.collection('turnos', ref =>
      ref.where('usuarioId', '==', user.uid)
    ).valueChanges({ idField: 'id' }).subscribe(data => {
      // Traer los eventos asociados
      const turnosConEventos = data.map(async (turno: any) => {
        const eventoSnap = await this.afs.collection('eventos').doc(turno.eventoId).get().toPromise();
        const eventoData = eventoSnap?.data() as any;
        return {
          ...turno,
          nombreEvento: eventoData && eventoData.nombre ? eventoData.nombre : 'Evento desconocido'
        };
      });

      Promise.all(turnosConEventos).then(completados => {
        this.turnosUsuario = completados;
      });
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

  verDetalleTurno(turno: any) {
    this.turnoSeleccionado = turno;
  }

  cerrarSesion() {
    this.auth.logout();
  }
}
