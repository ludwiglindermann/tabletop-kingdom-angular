import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 *  Componente encargado del inicio de sesión de usuarios en
 * TableTop Kingdom. Valida las credenciales contra los usuarios almacenados
 * en localStorage y, según el rol del usuario, redirige al panel de
 * administración o a la página de inicio.
 */
@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  loginForm: FormGroup;
  errorLogin: string = '';
  mostrarPassword: boolean = false;

  /**
   *  Alterna la visibilidad de la contraseña en el formulario,
   * mostrándola como texto o como puntos ocultos.
   */
  togglePassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

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

  constructor(private fb: FormBuilder, private router: Router) {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    if (!localStorage.getItem('usuarios')) {
      localStorage.setItem('usuarios', JSON.stringify(this.usuariosPorDefecto));
    }
  }

  get correo() { return this.loginForm.get('correo'); }
  get password() { return this.loginForm.get('password'); }

  /**
   *  Procesa el inicio de sesión. Valida el formulario, busca el
   * usuario por correo y contraseña, guarda la sesión activa en sessionStorage
   * y redirige según el rol (admin o cliente).
   */
  onSubmit() {
    this.errorLogin = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { correo, password } = this.loginForm.value;
    const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const usuario = usuarios.find((u: any) => u.correo === correo && u.password === password);

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

  /**
   *  Limpia los campos del formulario de login y borra el mensaje
   * de error en caso de existir.
   */
  onLimpiar() {
    this.loginForm.reset();
    this.errorLogin = '';
  }
}