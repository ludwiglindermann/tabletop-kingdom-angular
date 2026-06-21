import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

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

  onLimpiar() {
    this.loginForm.reset();
    this.errorLogin = '';
  }
}