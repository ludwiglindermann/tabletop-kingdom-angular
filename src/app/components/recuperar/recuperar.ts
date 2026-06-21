import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

function passwordsIgualesValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('nuevaPassword')?.value;
  const password2 = control.get('confirmarPassword')?.value;
  if (password !== password2) {
    return { passwordsNoCoinciden: true };
  }
  return null;
}

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
  selector: 'app-recuperar',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './recuperar.html',
  styleUrl: './recuperar.css'
})
export class RecuperarComponent {

  recuperarForm: FormGroup;
  errorCorreoNoExiste: string = '';
  mensajeExito: string = '';
  mostrarPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.recuperarForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      nuevaPassword: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(18), passwordSeguraValidator]],
      confirmarPassword: ['', [Validators.required]]
    }, { validators: passwordsIgualesValidator });
  }

  get correo() { return this.recuperarForm.get('correo'); }
  get nuevaPassword() { return this.recuperarForm.get('nuevaPassword'); }
  get confirmarPassword() { return this.recuperarForm.get('confirmarPassword'); }

  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  onSubmit() {
    this.errorCorreoNoExiste = '';
    this.mensajeExito = '';

    if (this.recuperarForm.invalid) {
      this.recuperarForm.markAllAsTouched();
      return;
    }

    const { correo, nuevaPassword } = this.recuperarForm.value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex((u: any) => u.correo === correo);

    if (index === -1) {
      this.errorCorreoNoExiste = 'No existe una cuenta con ese correo';
      return;
    }

    usuarios[index].password = nuevaPassword;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    this.mensajeExito = '¡Contraseña actualizada! Redirigiendo al login...';
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000);
  }

  onLimpiar() {
    this.recuperarForm.reset();
    this.errorCorreoNoExiste = '';
    this.mensajeExito = '';
  }
}