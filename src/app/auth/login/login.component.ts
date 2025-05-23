import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: false,
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private authService: AuthService) {}

  login() {
    this.authService.login(this.email, this.password);
  }

  recuperarContrasena() {
  const email = prompt('📧 Ingresa tu correo para recuperar la contraseña:');
  if (email) {
    this.authService.enviarCorreoRecuperacion(email);
  }
}





  
}
