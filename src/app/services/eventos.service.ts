import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class EventosService {
  constructor(private afs: AngularFirestore) {}

  crearEvento(nombre: string, fecha: Date, creadoPor: string) {
    return this.afs.collection('eventos').add({
      nombre,
      fecha,
      creadoPor
    });
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
