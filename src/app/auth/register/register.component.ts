import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';

@Component({
  standalone: false,
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  private role = 'usuario'; // o 'admin'

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router
  ) {}

  async register() {
    try {
      const cred = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
      await this.afs.collection('usuarios').doc(cred.user?.uid).set({
        email: this.email,
        role: this.role
      });
      alert('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      this.router.navigate(['/login']);
    } catch (error: any) {
      alert('❌ Error al registrar: ' + error.message);
    }
  }
}
