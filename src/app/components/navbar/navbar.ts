import { Component, OnInit } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent implements OnInit {
  usuarioActivo: any = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Revisar sesión cada vez que cambia la ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.cargarSesion();
      }
    });
    this.cargarSesion();
  }

  cargarSesion() {
    const datos = sessionStorage.getItem('usuarioActivo');
    if (datos) {
      this.usuarioActivo = JSON.parse(datos);
    } else {
      this.usuarioActivo = null;
    }
  }

  cerrarSesion() {
    sessionStorage.clear();
    this.usuarioActivo = null;
    this.router.navigate(['/login']);
  }
}