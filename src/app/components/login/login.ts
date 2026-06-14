import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  correo: string = '';
  password: string = '';
  errorCorreo: string = '';
  errorPassword: string = '';
  errorLogin: string = '';

  usuariosPorDefecto = [
    {
      nombre: 'Administrador',
      usuario: 'admin',
      correo: 'admin@tabletop.cl',
      password: 'Admin123',
      rol: 'admin',
      fechaNacimiento: '1990-01-01',
      direccion: 'Calle Admin 123'
    },
    {
      nombre: 'Cliente Demo',
      usuario: 'cliente',
      correo: 'cliente@tabletop.cl',
      password: 'Cliente123',
      rol: 'cliente',
      fechaNacimiento: '2000-05-15',
      direccion: 'Calle Cliente 456'
    }
  ];

  constructor(private router: Router) {
    if (!localStorage.getItem('usuarios')) {
      localStorage.setItem('usuarios', JSON.stringify(this.usuariosPorDefecto));
    }
  }

  iniciarSesion() {
    this.errorCorreo = '';
    this.errorPassword = '';
    this.errorLogin = '';

    let valido = true;

    if (this.correo === '') {
      this.errorCorreo = 'El correo es obligatorio';
      valido = false;
    }

    if (this.password === '') {
      this.errorPassword = 'La contraseña es obligatoria';
      valido = false;
    }

    if (!valido) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) =>
      u.correo === this.correo && u.password === this.password
    );

    if (!usuario) {
      this.errorLogin = 'Correo o contraseña incorrectos';
      return;
    }

    sessionStorage.setItem('usuarioActivo', JSON.stringify(usuario));
    sessionStorage.setItem('rolActivo', usuario.rol);

    if (usuario.rol === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/']);
    }
  }

  limpiar() {
    this.correo = '';
    this.password = '';
    this.errorCorreo = '';
    this.errorPassword = '';
    this.errorLogin = '';
  }
}