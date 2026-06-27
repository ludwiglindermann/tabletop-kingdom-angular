import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 *  Validador personalizado a nivel de formulario que comprueba
 * que la contraseña y su confirmación coincidan, solo cuando el usuario
 * decide cambiar la contraseña.
 * @param control Grupo de controles del formulario de perfil.
 * @returns Un objeto de error `{ passwordsNoCoinciden: true }` si no
 * coinciden, o `null` si son iguales o están vacías.
 */
function passwordsIgualesValidator(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const password2 = control.get('password2')?.value;
  if (password && password2 && password !== password2) {
    return { passwordsNoCoinciden: true };
  }
  return null;
}

/**
 *  Validador personalizado que exige que la contraseña contenga
 * al menos una mayúscula y un número. No valida si el campo está vacío, ya
 * que cambiar la contraseña en el perfil es opcional.
 * @param control Control del formulario que contiene la contraseña.
 * @returns Un objeto de error `{ passwordInsegura: true }` si falta mayúscula
 * o número, o `null` si es segura o está vacía.
 */
function passwordSeguraValidator(control: AbstractControl): ValidationErrors | null {
  const valor = control.value;
  if (!valor) return null;
  const tieneMayuscula = /[A-Z]/.test(valor);
  const tieneNumero = /[0-9]/.test(valor);

  if (!tieneMayuscula || !tieneNumero) {
    return { passwordInsegura: true };
  }
  return null;
}

/**
 *  Validador personalizado que verifica que el usuario tenga al
 * menos 13 años a partir de su fecha de nacimiento.
 * @param control Control del formulario que contiene la fecha de nacimiento.
 * @returns Un objeto de error `{ edadMinima: true }` si la edad es menor a
 * 13 años, o `null` si cumple con la edad mínima.
 */
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

/**
 *  Componente que permite a un usuario autenticado visualizar y
 * modificar los datos de su perfil. Carga la sesión activa desde
 * sessionStorage, precarga los datos en el formulario y guarda los cambios
 * tanto en localStorage como en la sesión activa.
 */
@Component({
  selector: 'app-perfil',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './perfil.html',
  styleUrl: './perfil.css'
})
export class PerfilComponent {

  perfilForm: FormGroup;
  mensajeExito: string = '';
  usuarioActivo: any = null;
  mostrarPassword: boolean = false;

  constructor(private fb: FormBuilder, private router: Router) {
    this.perfilForm = this.fb.group({
      nombre: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      correo: [{ value: '', disabled: true }],
      password: ['', [Validators.minLength(6), Validators.maxLength(18), passwordSeguraValidator]],
      password2: [''],
      fecha: ['', [Validators.required, edadMinimaValidator]],
      direccion: ['']
    }, { validators: passwordsIgualesValidator });

    const datos = sessionStorage.getItem('usuarioActivo');
    if (!datos) {
      this.router.navigate(['/login']);
      return;
    }
    this.usuarioActivo = JSON.parse(datos);

    this.perfilForm.patchValue({
      nombre: this.usuarioActivo.nombre,
      usuario: this.usuarioActivo.usuario,
      correo: this.usuarioActivo.correo,
      fecha: this.usuarioActivo.fechaNacimiento,
      direccion: this.usuarioActivo.direccion || ''
    });
  }

  get nombre() { return this.perfilForm.get('nombre'); }
  get usuario() { return this.perfilForm.get('usuario'); }
  get password() { return this.perfilForm.get('password'); }
  get password2() { return this.perfilForm.get('password2'); }
  get fecha() { return this.perfilForm.get('fecha'); }

  /**
   *  Alterna la visibilidad de la contraseña entre texto visible
   * y oculto.
   */
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  /**
   *  Guarda los cambios del perfil. Valida el formulario, actualiza
   * los datos del usuario en localStorage y en la sesión activa, y actualiza la
   * contraseña solo si el usuario ingresó una nueva.
   */
  onSubmit() {
    this.mensajeExito = '';

    if (this.perfilForm.invalid) {
      this.perfilForm.markAllAsTouched();
      return;
    }

    const datos = this.perfilForm.getRawValue();

    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const index = usuarios.findIndex((u: any) => u.correo === this.usuarioActivo.correo);

    if (index !== -1) {
      usuarios[index].nombre = datos.nombre;
      usuarios[index].usuario = datos.usuario;
      usuarios[index].fechaNacimiento = datos.fecha;
      usuarios[index].direccion = datos.direccion;
      if (datos.password) {
        usuarios[index].password = datos.password;
      }
      localStorage.setItem('usuarios', JSON.stringify(usuarios));
      sessionStorage.setItem('usuarioActivo', JSON.stringify(usuarios[index]));
      this.usuarioActivo = usuarios[index];
    }

    this.mensajeExito = '¡Perfil actualizado exitosamente!';
  }

  /**
   *  Cierra la sesión del usuario, limpia sessionStorage y redirige
   * al formulario de login.
   */
  cerrarSesion() {
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}