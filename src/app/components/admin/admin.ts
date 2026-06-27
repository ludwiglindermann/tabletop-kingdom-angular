import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 *  Componente del panel de administración. Solo es accesible para
 * usuarios con rol de administrador; si no hay sesión o el rol no es admin,
 * redirige fuera del panel. Permite listar y eliminar usuarios registrados.
 */
@Component({
  selector: 'app-admin',
  imports: [RouterLink, CommonModule],
  templateUrl: './admin.html',
  styleUrl: './admin.css'
})
export class AdminComponent {

  usuarioActivo: any = null;
  usuarios: any[] = [];

  constructor(private router: Router) {
    const datos = sessionStorage.getItem('usuarioActivo');
    if (!datos) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuarioActivo = JSON.parse(datos);
    if (this.usuarioActivo.rol !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.cargarUsuarios();
  }

  /**
   *  Carga la lista de usuarios registrados desde localStorage.
   */
  cargarUsuarios() {
    this.usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
  }

  /**
   *  Elimina un usuario de la lista según su posición, evitando
   * eliminar al administrador y pidiendo confirmación antes de borrar.
   * @param index Posición del usuario dentro de la lista de usuarios.
   */
  eliminarUsuario(index: number) {
    if (this.usuarios[index].rol === 'admin') {
      alert('No puedes eliminar al administrador');
      return;
    }
    if (confirm('¿Estás seguro de eliminar este usuario?')) {
      this.usuarios.splice(index, 1);
      localStorage.setItem('usuarios', JSON.stringify(this.usuarios));
      this.cargarUsuarios();
    }
  }

  /**
   *  Cierra la sesión del administrador y redirige al login.
   */
  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}