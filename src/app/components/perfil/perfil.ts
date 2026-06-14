import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent {

  nombre: string = '';
  usuario: string = '';
  correo: string = '';
  password: string = '';
  password2: string = '';
  fecha: string = '';
  direccion: string = '';

  errorNombre: string = '';
  errorUsuario: string = '';
  errorPassword: string = '';
  errorPassword2: string = '';
  errorFecha: string = '';
  mensajeExito: string = '';

  usuarioActivo: any = null;

  constructor(private router: Router) {
    const datos = sessionStorage.getItem('usuarioActivo');
    if (!datos) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuarioActivo = JSON.parse(datos);
    this.nombre = this.usuarioActivo.nombre;
    this.usuario = this.usuarioActivo.usuario;
    this.correo = this.usuarioActivo.correo;
    this.fecha = this.usuarioActivo.fechaNacimiento;
    this.direccion = this.usuarioActivo.direccion || '';
  }

  guardar() {
    this.errorNombre = '';
    this.errorUsuario = '';
    this.errorPassword = '';
    this.errorPassword2 = '';
    this.errorFecha = '';
    this.mensajeExito = '';

    let valido = true;

    if (this.nombre === '') {
      this.errorNombre = 'El nombre es obligatorio';
      valido = false;
    }

    if (this.usuario === '') {
      this.errorUsuario = 'El nombre de usuario es obligatorio';
      valido = false;
    }

    const regexMayuscula = /[A-Z]/;
    const regexNumero = /[0-9]/;
    if (this.password !== '') {
      if (this.password.length < 6 || this.password.length > 18) {
        this.errorPassword = 'La contraseña debe tener entre 6 y 18 caracteres';
        valido = false;
      } else if (!regexMayuscula.test(this.password)) {
        this.errorPassword = 'La contraseña debe tener al menos una letra mayúscula';
        valido = false;
      } else if (!regexNumero.test(this.password)) {
        this.errorPassword = 'La contraseña debe tener al menos un número';
        valido = false;
      } else if (this.password !== this.password2) {
        this.errorPassword2 = 'Las contraseñas no coinciden';
        valido = false;
      }
    }

    if (this.fecha === '') {
      this.errorFecha = 'La fecha de nacimiento es obligatoria';
      valido = false;
    }

    if (!valido) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex((u: any) => u.correo === this.usuarioActivo.correo);

    if (index !== -1) {
      usuarios[index].nombre = this.nombre;
      usuarios[index].usuario = this.usuario;
      usuarios[index].fechaNacimiento = this.fecha;
      usuarios[index].direccion = this.direccion;
      if (this.password !== '') {
        usuarios[index].password = this.password;
      }
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarios[index]));
    }

    this.mensajeExito = '¡Perfil actualizado exitosamente!';
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}