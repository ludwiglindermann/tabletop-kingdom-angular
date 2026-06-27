import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 *  Validador personalizado a nivel de formulario que comprueba
 * que la nueva contraseña y su confirmación sean idénticas.
 * @param control Grupo de controles del formulario de recuperación.
 * @returns Un objeto de error `{ passwordsNoCoinciden: true }` si no
 * coinciden, o `null` si son iguales.
 */
function passwordsIgualesValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('nuevaPassword')?.value;
  const password2 = control.get('confirmarPassword')?.value;
  if (password !== password2) {
    return { passwordsNoCoinciden: true };
  }
  return null;
}

/**
 *  Validador personalizado que exige que la contraseña contenga
 * al menos una letra mayúscula y un número.
 * @param control Control del formulario que contiene la nueva contraseña.
 * @returns Un objeto de error `{ passwordInsegura: true }` si falta mayúscula
 * o número, o `null` si es segura.
 */
function passwordSeguraValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value || '';
  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);

  if (!tieneMayuscula || !tieneNumero) {
    return { passwordInsegura: true };
  }
  return null;
}

/**
 *  Componente que permite a un usuario recuperar y restablecer su
 * contraseña. Verifica que el correo exista entre los usuarios registrados y,
 * si es así, actualiza la contraseña en localStorage.
 */
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

  /**
   *  Alterna la visibilidad de la contraseña entre texto visible
   * y oculto.
   */
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  /**
   *  Procesa la recuperación de contraseña. Valida el formulario,
   * busca el correo entre los usuarios registrados y, si existe, actualiza la
   * contraseña y redirige al login.
   */
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

  /**
   *  Limpia los campos del formulario de recuperación y borra los
   * mensajes de éxito o error.
   */
  onLimpiar() {
    this.recuperarForm.reset();
    this.errorCorreoNoExiste = '';
    this.mensajeExito = '';
  }
}