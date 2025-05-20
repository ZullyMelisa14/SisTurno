import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  usuarioActual: any = null;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

    login(email: string, password: string) {
  return this.afAuth.signInWithEmailAndPassword(email, password)
    .then(async cred => {
      if (cred.user) {
        const userDoc = await this.afs.collection('usuarios').doc(cred.user.uid).get().toPromise();
        const userData = userDoc?.data() as any;

        this.usuarioActual = {
         uid: cred.user?.uid,
         ...userData
        };

        if (!userData || !userData.role) {
          alert('⚠️ El usuario no tiene asignado un rol.');
          return;
        }

        const rol = userData.role;

        if (rol === 'admin') {
          this.router.navigate(['/admin']);
        } else if (rol === 'usuario') {
          this.router.navigate(['/user']);
        } else {
          alert('Rol no reconocido');
        }
      }
    })
    .catch(err => {
      alert('Error al iniciar sesión: ' + err.message);
    });
}




  logout() {
    this.afAuth.signOut().then(() => {
      this.usuarioActual = null;
      this.router.navigate(['/login']);
    });
  }

  getRol(): string | null {
    return this.usuarioActual?.role || null;
  }

  getUsuarioActual() {
    return this.usuarioActual;
  }

  enviarCorreoRecuperacion(email: string) {
  this.afAuth.sendPasswordResetEmail(email)
    .then(() => {
      alert('✅ Se envió un correo de recuperación. Revisa tu bandeja de entrada.');
    })
    .catch(err => {
      alert('❌ Error al enviar correo: ' + err.message);
    });
}

}
