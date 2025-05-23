import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

export interface Usuario {
  id?: string;
  email: string;
  role: string;
}

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private coleccion = 'usuarios';

  constructor(private afs: AngularFirestore) {}

  obtenerUsuarios(): Observable<Usuario[]> {
    return this.afs.collection<Usuario>(this.coleccion).valueChanges({ idField: 'id' });
  }

  crearUsuario(usuario: Usuario): Promise<void> {
    const id = this.afs.createId();
    return this.afs.collection<Usuario>(this.coleccion).doc(id).set(usuario);
  }

  actualizarUsuario(id: string, datos: Partial<Usuario>): Promise<void> {
    return this.afs.collection<Usuario>(this.coleccion).doc(id).update(datos);
  }

  eliminarUsuario(id: string): Promise<void> {
    return this.afs.collection<Usuario>(this.coleccion).doc(id).delete();
  }
}
