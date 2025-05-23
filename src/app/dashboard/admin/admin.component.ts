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

  turnosActivados = false;
  cantidadTurnos: number | null = null;
  stockTurnos: number | null = null;

  usuarioActual: any;

  constructor(
    private eventosService: EventosService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.auth.getUsuarioActual();
    if (this.usuarioActual) {
      this.cargarEventos();
    }
  }

  cargarEventos() {
    this.eventosService.obtenerEventosDelUsuario(this.usuarioActual.uid).subscribe(data => {
      this.eventos = data;
    });
  }

  crearEvento() {
    if (!this.usuarioActual) {
      alert('No hay usuario autenticado');
      return;
    }

    // Validaciones extra para turnos si está activado
    if (this.turnosActivados) {
      if (!this.cantidadTurnos || this.cantidadTurnos < 1) {
        alert('Debe ingresar una cantidad válida de turnos (mínimo 1)');
        return;
      }
      if (!this.stockTurnos || this.stockTurnos < 1) {
        alert('Debe ingresar un stock válido por turno (mínimo 1)');
        return;
      }
    }

    const fecha = new Date(this.fechaEvento);

    const nuevoEvento: any = {
      nombre: this.nombreEvento.trim(),
      fecha,
      userId: this.usuarioActual.uid,
    };

    // Agregar info de turnos si está activado
    if (this.turnosActivados) {
      nuevoEvento.turnos = {
        activados: true,
        cantidad: this.cantidadTurnos,
        stock: this.stockTurnos
      };
    } else {
      nuevoEvento.turnos = {
        activados: false
      };
    }

    this.eventosService.crearEvento(
      nuevoEvento.nombre,
      nuevoEvento.fecha,
      nuevoEvento.userId,
      nuevoEvento.turnos
    ).then(() => {
      alert('✅ Evento creado exitosamente');
      this.nombreEvento = '';
      this.fechaEvento = '';
      this.turnosActivados = false;
      this.cantidadTurnos = null;
      this.stockTurnos = null;
      this.cargarEventos();
    }).catch(err => {
      alert('❌ Error al crear el evento: ' + err.message);
    });
  }

  eliminarEvento(id: string) {
    if (confirm('¿Estás seguro de eliminar este evento?')) {
      this.eventosService.eliminarEvento(id).then(() => {
        alert('Evento eliminado');
        this.cargarEventos();
      });
    }
  }

  editarEvento(evento: any) {
  const nuevoNombre = prompt('Nuevo nombre del evento:', evento.nombre);
  const nuevaFechaStr = prompt('Nueva fecha (YYYY-MM-DD):', evento.fecha?.toDate ? evento.fecha.toDate().toISOString().substring(0,10) : evento.fecha);
  
  // Para turnos, si existen:
  const turnos = evento.turnos || { activados: false, cantidad: 0, stock: 0 };
  
  const activadosStr = prompt('¿Activar turnos? (sí/no):', turnos.activados ? 'sí' : 'no');
  let activados = (activadosStr?.toLowerCase() === 'sí' || activadosStr?.toLowerCase() === 'si');
  
  let cantidad = 0;
  let stock = 0;
  
  if (activados) {
    const cantidadStr = prompt('Cantidad de turnos:', turnos.cantidad?.toString() || '0');
    cantidad = cantidadStr ? parseInt(cantidadStr) : 0;
  }

  if (nuevoNombre && nuevaFechaStr) {
    const nuevaFecha = new Date(nuevaFechaStr);
    const datosActualizar: any = {
      nombre: nuevoNombre.trim(),
      fecha: nuevaFecha,
      turnos: {
        activados,
        cantidad,
      }
    };

    // Si no están activados, mejor eliminamos el objeto turnos para evitar datos innecesarios
    if (!activados) {
      delete datosActualizar.turnos;
    }

    this.eventosService.actualizarEvento(evento.id, datosActualizar).then(() => {
      alert('Evento actualizado');
      this.cargarEventos();
    });
  }
}


  cerrarSesion() {
    this.auth.logout();
  }
}
