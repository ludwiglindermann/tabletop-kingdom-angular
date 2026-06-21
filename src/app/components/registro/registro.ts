import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

// Validador personalizado: las contraseñas deben coincidir
function passwordsIgualesValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const password2 = control.get('password2')?.value;
  if (password !== password2) {
    return { passwordsNoCoinciden: true };
  }
  return null;
}

// Validador personalizado: edad mínima 13 años
function edadMinimaValidator(control: AbstractControl): ValidationErrors | null {
  const fecha = control.value;
  if (!fecha) return null;

  const hoy = new Date();
  const nacimiento = new Date(fecha);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const mes = hoy.getMonth() - nacimiento.getMonth();
  if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
    edad--;
  }

  return edad < 13 ? { edadMinima: true } : null;
}

// Validador personalizado: contraseña segura (mayúscula + número)
function passwordSeguraValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value || '';
  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);

  if (!tieneMayuscula || !tieneNumero) {
    return { passwordInsegura: true };
  }
  return null;
}

@Component({
  selector: 'app-registro',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css'
})
export class RegistroComponent {

  registroForm: FormGroup;
  mensajeExito: string = '';
  errorCorreoExistente: string = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), passwordSeguraValidator]],
      password2: ['', [Validators.required]],
      fecha: ['', [Validators.required, edadMinimaValidator]],
      direccion: ['']
    }, { validators: passwordsIgualesValidator });
  }

  // Getters para acceder fácil a los controles desde el HTML
  get nombre() { return this.registroForm.get('nombre'); }
  get usuario() { return this.registroForm.get('usuario'); }
  get correo() { return this.registroForm.get('correo'); }
  get password() { return this.registroForm.get('password'); }
  get password2() { return this.registroForm.get('password2'); }
  get fecha() { return this.registroForm.get('fecha'); }

  onSubmit() {
    this.errorCorreoExistente = '';
    this.mensajeExito = '';

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    const datos = this.registroForm.value;

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const existe = usuarios.find((u: any) => u.correo === datos.correo);
    if (existe) {
      this.errorCorreoExistente = 'Ya existe una cuenta con ese correo';
      return;
    }

    const nuevoUsuario = {
      nombre: datos.nombre,
      usuario: datos.usuario,
      correo: datos.correo,
      password: datos.password,
      rol: 'cliente',
      fechaNacimiento: datos.fecha,
      direccion: datos.direccion
    };

    usuarios.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mensajeExito = '¡Registro exitoso! Redirigiendo al login...';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  onLimpiar() {
    this.registroForm.reset();
    this.mensajeExito = '';
    this.errorCorreoExistente = '';
  }
}