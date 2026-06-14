import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-recuperar',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class RecuperarComponent {

  correo: string = '';
  nuevaPassword: string = '';
  confirmarPassword: string = '';

  errorCorreo: string = '';
  errorPassword: string = '';
  errorConfirmar: string = '';
  mensajeExito: string = '';

  constructor(private router: Router) {}

  recuperar() {
    this.errorCorreo = '';
    this.errorPassword = '';
    this.errorConfirmar = '';
    this.mensajeExito = '';

    let valido = true;

    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.correo === '') {
      this.errorCorreo = 'El correo es obligatorio';
      valido = false;
    } else if (!regexCorreo.test(this.correo)) {
      this.errorCorreo = 'El correo no tiene un formato válido';
      valido = false;
    }

    const regexMayuscula = /[A-Z]/;
    const regexNumero = /[0-9]/;
    if (this.nuevaPassword === '') {
      this.errorPassword = 'La contraseña es obligatoria';
      valido = false;
    } else if (this.nuevaPassword.length < 6 || this.nuevaPassword.length > 18) {
      this.errorPassword = 'La contraseña debe tener entre 6 y 18 caracteres';
      valido = false;
    } else if (!regexMayuscula.test(this.nuevaPassword)) {
      this.errorPassword = 'La contraseña debe tener al menos una letra mayúscula';
      valido = false;
    } else if (!regexNumero.test(this.nuevaPassword)) {
      this.errorPassword = 'La contraseña debe tener al menos un número';
      valido = false;
    }

    if (this.confirmarPassword === '') {
      this.errorConfirmar = 'Debes confirmar la contraseña';
      valido = false;
    } else if (this.nuevaPassword !== this.confirmarPassword) {
      this.errorConfirmar = 'Las contraseñas no coinciden';
      valido = false;
    }

    if (!valido) return;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex((u: any) => u.correo === this.correo);

    if (index === -1) {
      this.errorCorreo = 'No existe una cuenta con ese correo';
      return;
    }

    usuarios[index].password = this.nuevaPassword;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mensajeExito = '¡Contraseña actualizada! Redirigiendo al login...';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  limpiar() {
    this.correo = '';
    this.nuevaPassword = '';
    this.confirmarPassword = '';
    this.errorCorreo = '';
    this.errorPassword = '';
    this.errorConfirmar = '';
    this.mensajeExito = '';
  }
}