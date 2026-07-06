import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuegoCardComponent } from '../juego-card/juego-card';
import { Datos } from '../../services/datos';

/**
 * Componente que muestra los juegos de una categoría específica. Lee el
 * identificador de la categoría desde la ruta, obtiene los juegos desde un
 * archivo JSON mediante el servicio Datos, permite filtrarlos por nombre con
 * un buscador (ngModel) y agregarlos al carrito validando la sesión activa.
 */
@Component({
  selector: 'app-categorias',
  imports: [RouterLink, CommonModule, FormsModule, JuegoCardComponent],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent implements OnInit {

  categoriaActual: string = '';
  mensajeAgregado: string = '';

  /** Texto ingresado por el usuario en el buscador para filtrar los juegos por nombre. */
  filtroBusqueda: string = '';

  /** Objeto con todas las categorías y sus juegos, recibido desde el archivo JSON. */
  todasLasCategorias: any = {};

  /** Datos de la categoría actualmente seleccionada. */
  categoriaData: any = null;

  /** Indica si los datos aún se están cargando. */
  cargando: boolean = true;

  /** Mensaje de error en caso de que falle la carga de datos. */
  error: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private datosService: Datos,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Al iniciar el componente, solicita los juegos al servicio. Una vez recibidos,
   * observa el parámetro de la ruta para mostrar la categoría correspondiente.
   */
  ngOnInit(): void {
    this.datosService.getJuegos().subscribe({
      next: (datos) => {
        this.todasLasCategorias = datos;
        this.cargando = false;
        this.route.params.subscribe(params => {
          this.categoriaActual = params['id'];
          this.categoriaData = this.todasLasCategorias[this.categoriaActual];
          this.filtroBusqueda = '';
        });
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los juegos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /**
   * Devuelve la lista de juegos de la categoría filtrada según el texto del
   * buscador. Si el buscador está vacío, devuelve todos los juegos.
   */
  get juegosFiltrados(): any[] {
    if (!this.categoriaData) {
      return [];
    }
    const texto = this.filtroBusqueda.trim().toLowerCase();
    if (!texto) {
      return this.categoriaData.juegos;
    }
    return this.categoriaData.juegos.filter((juego: any) =>
      juego.nombre.toLowerCase().includes(texto)
    );
  }

  /**
   * Agrega un juego al carrito de compras. Verifica que exista una sesión
   * activa; si no la hay, redirige al login. Si el juego ya está en el carrito,
   * incrementa su cantidad; de lo contrario, lo agrega como nuevo.
   * Este método se ejecuta cuando el componente hijo (ficha de juego) emite
   * el evento 'agregar'.
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
    this.mensajeAgregado = `✅ ${juego.nombre} agregado al carrito`;
    setTimeout(() => {
      this.mensajeAgregado = '';
    }, 2000);
  }
}