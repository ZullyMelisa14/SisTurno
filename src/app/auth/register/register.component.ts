// register.component.ts
import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  email = '';
  password = '';
  role = 'usuario'; // o 'admin'

  constructor(private afAuth: AngularFireAuth, private afs: AngularFirestore) {}

  async register() {
    const cred = await this.afAuth.createUserWithEmailAndPassword(this.email, this.password);
    return this.afs.collection('usuarios').doc(cred.user?.uid).set({
      email: this.email,
      role: this.role
    });
  }
}
