import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 *  Componente del menú de navegación principal. Muestra opciones
 * distintas según el estado de la sesión y el rol del usuario (administrador o
 * cliente), y permite cerrar sesión. Se actualiza automáticamente cada vez que
 * cambia la ruta de la aplicación.
 */
@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  usuarioActivo: any = null;

  constructor(private router: Router) {}

  /**
   *  Se ejecuta al iniciar el componente. Suscribe la navegación
   * para recargar la sesión cada vez que cambia la ruta y carga la sesión
   * actual al arrancar.
   */
  ngOnInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.cargarSesion();
      }
    });
    this.cargarSesion();
  }

  /**
   *  Lee la sesión activa desde sessionStorage y la guarda en la
   * propiedad `usuarioActivo`. Si no hay sesión, deja la propiedad en `null`.
   */
  cargarSesion() {
    const datos = sessionStorage.getItem('usuarioActivo');
    if (datos) {
      this.usuarioActivo = JSON.parse(datos);
    } else {
      this.usuarioActivo = null;
    }
  }

  /**
   *  Cierra la sesión del usuario, limpia sessionStorage y redirige
   * al formulario de login.
   */
  cerrarSesion() {
    sessionStorage.clear();
    this.usuarioActivo = null;
    this.router.navigate(['/login']);
  }
}