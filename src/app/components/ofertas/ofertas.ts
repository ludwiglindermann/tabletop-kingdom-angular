import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JuegoCardComponent } from '../juego-card/juego-card';
import { Datos } from '../../services/datos';

/**
 * Componente que muestra una página de ofertas con todos los juegos que tienen
 * descuento. Consume los datos desde el archivo juegos.json a través del
 * servicio Datos, recorre todas las categorías y filtra únicamente los juegos
 * en oferta, reutilizando el componente de ficha de juego.
 */
@Component({
  selector: 'app-ofertas',
  imports: [RouterLink, CommonModule, JuegoCardComponent],
  templateUrl: './ofertas.html',
  styleUrl: './ofertas.css'
})
export class OfertasComponent implements OnInit {

  /** Lista de juegos con descuento reunidos desde todas las categorías. */
  juegosEnOferta: any[] = [];

  /** Indica si los datos aún se están cargando. */
  cargando: boolean = true;

  /** Mensaje de error en caso de que falle la carga de datos. */
  error: string = '';

  constructor(
    private datosService: Datos,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Al iniciar el componente, solicita los juegos al servicio, recorre todas
   * las categorías y guarda solo los juegos que tienen descuento.
   */
  ngOnInit(): void {
    this.datosService.getJuegos().subscribe({
      next: (datos) => {
        const listaOfertas: any[] = [];
        for (const clave of Object.keys(datos)) {
          const juegosCategoria = datos[clave].juegos;
          for (const juego of juegosCategoria) {
            if (juego.descuento) {
              listaOfertas.push(juego);
            }
          }
        }
        this.juegosEnOferta = listaOfertas;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las ofertas.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Agrega un juego al carrito de compras. Verifica que exista una sesión
   * activa; si no la hay, redirige al login. Si el juego ya está en el carrito,
   * incrementa su cantidad; de lo contrario, lo agrega como nuevo.
   * @param juego Objeto del juego que se desea agregar al carrito.
   */
  agregarAlCarrito(juego: any) {
    const usuarioActivo = sessionStorage.getItem('usuarioActivo');
    if (!usuarioActivo) {
      alert('Debes iniciar sesión para agregar productos al carrito');
      this.router.navigate(['/login']);
      return;
    }

    const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    const index = carrito.findIndex((item: any) => item.nombre === juego.nombre);

    if (index !== -1) {
      carrito[index].cantidad++;
    } else {
      carrito.push({ ...juego, cantidad: 1 });
    }

    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
}