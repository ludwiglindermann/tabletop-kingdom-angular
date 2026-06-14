import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  nombre: string = '';
  usuario: string = '';
  correo: string = '';
  password: string = '';
  password2: string = '';
  fecha: string = '';
  direccion: string = '';

  errorNombre: string = '';
  errorUsuario: string = '';
  errorCorreo: string = '';
  errorPassword: string = '';
  errorPassword2: string = '';
  errorFecha: string = '';
  mensajeExito: string = '';

  constructor(private router: Router) {}

  registrar() {
    this.errorNombre = '';
    this.errorUsuario = '';
    this.errorCorreo = '';
    this.errorPassword = '';
    this.errorPassword2 = '';
    this.errorFecha = '';
    this.mensajeExito = '';

    let valido = true;

    if (this.nombre === '') {
      this.errorNombre = 'El nombre completo es obligatorio';
      valido = false;
    }

    if (this.usuario === '') {
      this.errorUsuario = 'El nombre de usuario es obligatorio';
      valido = false;
    }

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.correo === '') {
      this.errorCorreo = 'El correo electrónico es obligatorio';
      valido = false;
    } else if (!regexCorreo.test(this.correo)) {
      this.errorCorreo = 'El correo no tiene un formato válido';
      valido = false;
    }

    const regexMayuscula = /[A-Z]/;
    const regexNumero = /[0-9]/;
    if (this.password === '') {
      this.errorPassword = 'La contraseña es obligatoria';
      valido = false;
    } else if (this.password.length < 6 || this.password.length > 18) {
      this.errorPassword = 'La contraseña debe tener entre 6 y 18 caracteres';
      valido = false;
    } else if (!regexMayuscula.test(this.password)) {
      this.errorPassword = 'La contraseña debe tener al menos una letra mayúscula';
      valido = false;
    } else if (!regexNumero.test(this.password)) {
      this.errorPassword = 'La contraseña debe tener al menos un número';
      valido = false;
    }

    if (this.password2 === '') {
      this.errorPassword2 = 'Debes repetir la contraseña';
      valido = false;
    } else if (this.password !== this.password2) {
      this.errorPassword2 = 'Las contraseñas no coinciden';
      valido = false;
    }

    if (this.fecha === '') {
      this.errorFecha = 'La fecha de nacimiento es obligatoria';
      valido = false;
    } else {
      const hoy = new Date();
      const nacimiento = new Date(this.fecha);
      let edad = hoy.getFullYear() - nacimiento.getFullYear();
      const mes = hoy.getMonth() - nacimiento.getMonth();
      if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
        edad--;
      }
      if (edad < 13) {
        this.errorFecha = 'Debes tener al menos 13 años para registrarte';
        valido = false;
      }
    }

    if (!valido) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.find((u: any) => u.correo === this.correo);
    if (existe) {
      this.errorCorreo = 'Ya existe una cuenta con ese correo';
      return;
    }

    const nuevoUsuario = {
      nombre: this.nombre,
      usuario: this.usuario,
      correo: this.correo,
      password: this.password,
      rol: 'cliente',
      fechaNacimiento: this.fecha,
      direccion: this.direccion
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mensajeExito = '¡Registro exitoso! Redirigiendo al login...';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  limpiar() {
    this.nombre = '';
    this.usuario = '';
    this.correo = '';
    this.password = '';
    this.password2 = '';
    this.fecha = '';
    this.direccion = '';
    this.errorNombre = '';
    this.errorUsuario = '';
    this.errorCorreo = '';
    this.errorPassword = '';
    this.errorPassword2 = '';
    this.errorFecha = '';
    this.mensajeExito = '';
  }
}