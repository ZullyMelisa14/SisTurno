import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  constructor(private afs: AngularFirestore) {}

  obtenerUsuarios(): Observable<any[]> {
    return this.afs.collection('usuarios').valueChanges({ idField: 'id' });
  }

  actualizarRol(uid: string, nuevoRol: string) {
    return this.afs.collection('usuarios').doc(uid).update({ role: nuevoRol });
  }
}
