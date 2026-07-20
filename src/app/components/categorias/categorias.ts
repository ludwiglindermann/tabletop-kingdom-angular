import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { JuegoCardComponent } from '../juego-card/juego-card';
import { Datos } from '../../services/datos';

/**
 * Componente que muestra los juegos de una categoría específica. Lee el
 * identificador de la categoría desde la ruta, obtiene los juegos desde
 * Firebase mediante el servicio Datos, los filtra por categoría, permite
 * buscarlos por nombre (ngModel) y agregarlos al carrito.
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

  /** Lista completa de juegos recibida desde Firebase. */
  todosLosJuegos: any[] = [];

  /** Nombres visibles de cada categoría. */
  nombresCategorias: any = {
    estrategia: 'Estrategia 🧠',
    familia: 'Familia 🎲',
    cartas: 'Cartas 🃏',
    misterio: 'Misterio 🔍'
  };

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
   * Al iniciar el componente, solicita todos los juegos al servicio. Una vez
   * recibidos, observa el parámetro de la ruta para saber qué categoría mostrar.
   */
  ngOnInit(): void {
    this.datosService.getJuegos().subscribe({
      next: (datos) => {
        this.todosLosJuegos = datos ? Object.values(datos).filter((j: any) => j !== null) : [];
        this.cargando = false;
        this.route.params.subscribe(params => {
          this.categoriaActual = params['id'];
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

  /** Devuelve el nombre visible de la categoría actual. */
  get nombreCategoria(): string {
    return this.nombresCategorias[this.categoriaActual] || this.categoriaActual;
  }

  /**
   * Devuelve los juegos de la categoría actual, aplicando además el filtro de
   * búsqueda por nombre si el usuario escribió algo en el buscador.
   */
  get juegosFiltrados(): any[] {
    let lista = this.todosLosJuegos.filter(j => j.categoria === this.categoriaActual);
    const texto = this.filtroBusqueda.trim().toLowerCase();
    if (texto) {
      lista = lista.filter(j => j.nombre.toLowerCase().includes(texto));
    }
    return lista;
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
    this.mensajeAgregado = `✅ ${juego.nombre} agregado al carrito`;
    setTimeout(() => {
      this.mensajeAgregado = '';
    }, 2000);
  }
}