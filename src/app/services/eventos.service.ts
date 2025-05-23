import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class EventosService {
  constructor(private afs: AngularFirestore) {}

  // Ahora acepta un objeto 'turnos' que puede ser null o con datos
  crearEvento(nombre: string, fecha: Date, creadoPor: string, turnos?: any) {
    const eventoData: any = {
      nombre,
      fecha,
      creadoPor
    };
    if (turnos) {
      eventoData.turnos = turnos;  // agregar info de turnos solo si existe
    }
    return this.afs.collection('eventos').add(eventoData);
  }

  obtenerEventos() {
    return this.afs.collection('eventos').valueChanges({ idField: 'id' });
  }

  obtenerEventosDelUsuario(uid: string) {
    return this.afs.collection('eventos', ref => ref.where('creadoPor', '==', uid))
      .valueChanges({ idField: 'id' });
  }

  eliminarEvento(id: string) {
    return this.afs.collection('eventos').doc(id).delete();
  }

  actualizarEvento(id: string, datos: any) {
    return this.afs.collection('eventos').doc(id).update(datos);
  }
}
