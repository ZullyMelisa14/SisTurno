import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  nuevoUsuario = {
    email: '',
    role: ''
  };

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  crearUsuario() {
    if (this.nuevoUsuario.email && this.nuevoUsuario.role) {
      this.usuarioService.crearUsuario(this.nuevoUsuario).then(() => {
        alert('✅ Usuario creado');
        this.nuevoUsuario = { email: '', role: '' };
        this.cargarUsuarios();
      }).catch(err => alert('❌ Error: ' + err.message));
    }
  }

  actualizarUsuario(usuario: any) {
    this.usuarioService.actualizarUsuario(usuario.id, {
      email: usuario.email,
      role: usuario.role
    }).then(() => {
      alert('✅ Usuario actualizado');
    });
  }

  eliminarUsuario(id: string) {
    if (confirm('¿Eliminar este usuario?')) {
      this.usuarioService.eliminarUsuario(id).then(() => {
        alert('🗑️ Usuario eliminado');
        this.cargarUsuarios();
      });
    }
  }
}
