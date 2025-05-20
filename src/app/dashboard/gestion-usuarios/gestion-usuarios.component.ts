import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';

@Component({
  selector: 'app-gestion-usuarios',
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.css']
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: any[] = [];

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.usuarioService.obtenerUsuarios().subscribe(data => {
      this.usuarios = data;
    });
  }

  cambiarRol(usuario: any, nuevoRol: string) {
    this.usuarioService.actualizarRol(usuario.id, nuevoRol).then(() => {
      alert(`✅ Rol actualizado a ${nuevoRol} para ${usuario.email}`);
    });
  }
}
