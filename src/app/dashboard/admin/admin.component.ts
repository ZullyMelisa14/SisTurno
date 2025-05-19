import { Component, OnInit } from '@angular/core';
import { EventosService } from '../../services/eventos.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  nombreEvento = '';
  fechaEvento: string = '';
  eventos: any[] = [];

  constructor(
    private eventosService: EventosService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    const usuario = this.auth.getUsuarioActual();
    if (usuario) {
      this.eventosService.obtenerEventosDelUsuario(usuario.uid).subscribe(data => {
        this.eventos = data;
      });
    }
  }

  crearEvento() {
    const fecha = new Date(this.fechaEvento);
    const user = this.auth.getUsuarioActual();

    if (user) {
      this.eventosService.crearEvento(this.nombreEvento, fecha, user.uid).then(() => {
        alert('✅ Evento creado exitosamente');
        this.nombreEvento = '';
        this.fechaEvento = '';
      }).catch(err => {
        alert('❌ Error al crear el evento: ' + err.message);
      });
    } else {
      alert('No hay usuario autenticado');
    }
  }

  eliminarEvento(id: string) {
  if (confirm('¿Estás seguro de eliminar este evento?')) {
    this.eventosService.eliminarEvento(id).then(() => {
      alert('Evento eliminado');
    });
  }
  }

  editarEvento(evento: any) {
  const nuevoNombre = prompt('Nuevo nombre del evento:', evento.nombre);
  const nuevaFechaStr = prompt('Nueva fecha (YYYY-MM-DD):', evento.fecha?.toDate ? evento.fecha.toDate().toISOString().substring(0,10) : evento.fecha);

  if (nuevoNombre && nuevaFechaStr) {
    const nuevaFecha = new Date(nuevaFechaStr);
    this.eventosService.actualizarEvento(evento.id, {
      nombre: nuevoNombre,
      fecha: nuevaFecha
    }).then(() => {
      alert('Evento actualizado');
    });
  }
}
cerrarSesion() {
  this.auth.logout();
}


}

