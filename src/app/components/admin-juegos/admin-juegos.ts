import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Datos } from '../../services/datos';

/**
 * Componente de administración de juegos. Permite al administrador realizar las
 * operaciones CRUD sobre los juegos almacenados en Firebase: listar (GET),
 * crear (POST/PUT), editar (PUT) y eliminar (DELETE). Solo es accesible para
 * usuarios con rol de administrador.
 */
@Component({
  selector: 'app-admin-juegos',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-juegos.html',
  styleUrl: './admin-juegos.css'
})
export class AdminJuegosComponent implements OnInit {

  /** Lista de juegos que se muestran en la tabla (con su posición en Firebase). */
  juegos: any[] = [];

  /** Indica si los datos aún se están cargando. */
  cargando: boolean = true;

  /** Mensaje de error en caso de fallo. */
  error: string = '';

  /** Mensaje de éxito tras una operación. */
  mensaje: string = '';

  /** Controla si el formulario de crear/editar está visible. */
  mostrarFormulario: boolean = false;

  /** Indica si el formulario está en modo edición (true) o creación (false). */
  modoEdicion: boolean = false;

  /** Posición en Firebase del juego que se está editando. */
  posEditando: number = -1;

  /** Próxima posición disponible para crear un juego nuevo. */
  siguientePos: number = 0;

  /** Objeto enlazado al formulario de crear/editar. */
  juegoForm: any = this.formVacio();

  /** Categorías disponibles para el selector. */
  categorias: string[] = ['estrategia', 'familia', 'cartas', 'misterio'];

  constructor(
    private datosService: Datos,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) { }

  /**
   * Al iniciar, verifica que el usuario sea administrador y carga los juegos.
   */
  ngOnInit(): void {
    const datos = sessionStorage.getItem('usuarioActivo');
    if (!datos) { this.router.navigate(['/login']); return; }
    const usuario = JSON.parse(datos);
    if (usuario.rol !== 'admin') { this.router.navigate(['/']); return; }
    this.cargarJuegos();
  }

  /** Devuelve un objeto de juego vacío para inicializar el formulario. */
  formVacio() {
    return {
      id: 0,
      nombre: '',
      categoria: 'estrategia',
      descripcion: '',
      precio: 0,
      descuento: false,
      imagen: 'images/juego-catan.jpg'
    };
  }

  /**
   * GET: Carga todos los juegos desde Firebase, guardando la posición de cada
   * uno para poder editarlos o eliminarlos después.
   */
  cargarJuegos(): void {
    this.datosService.getJuegos().subscribe({
      next: (datos) => {
        const crudo = datos || [];
        this.siguientePos = crudo.length;
        this.juegos = [];
        crudo.forEach((j: any, i: number) => {
          if (j !== null) {
            this.juegos.push({ ...j, _pos: i });
          }
        });
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar los juegos.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  /** Abre el formulario en modo creación. */
  abrirCrear(): void {
    this.modoEdicion = false;
    this.juegoForm = this.formVacio();
    this.mostrarFormulario = true;
  }

  /**
   * Abre el formulario en modo edición, cargando los datos del juego elegido.
   * @param juego Juego que se desea editar.
   */
  abrirEditar(juego: any): void {
    this.modoEdicion = true;
    this.posEditando = juego._pos;
    this.juegoForm = { ...juego };
    this.mostrarFormulario = true;
  }

  /** Cierra el formulario sin guardar. */
  cancelar(): void {
    this.mostrarFormulario = false;
  }

  /**
   * Guarda el juego del formulario. Si está en modo edición usa PUT para
   * actualizar; si está en modo creación usa PUT en una nueva posición (POST).
   */
  guardar(): void {
    const juego = {
      id: this.juegoForm.id,
      nombre: this.juegoForm.nombre,
      categoria: this.juegoForm.categoria,
      descripcion: this.juegoForm.descripcion,
      precio: Number(this.juegoForm.precio),
      descuento: this.juegoForm.descuento,
      imagen: this.juegoForm.imagen
    };

    if (this.modoEdicion) {
      this.datosService.actualizarJuego(this.posEditando, juego).subscribe({
        next: () => {
          this.mensaje = '✅ Juego actualizado correctamente';
          this.mostrarFormulario = false;
          this.cargarJuegos();
          this.limpiarMensaje();
        },
        error: () => { this.error = 'Error al actualizar el juego.'; this.cdr.detectChanges(); }
      });
    } else {
      juego.id = this.siguientePos + 1;
      this.datosService.crearJuego(juego, this.siguientePos).subscribe({
        next: () => {
          this.mensaje = '✅ Juego creado correctamente';
          this.mostrarFormulario = false;
          this.cargarJuegos();
          this.limpiarMensaje();
        },
        error: () => { this.error = 'Error al crear el juego.'; this.cdr.detectChanges(); }
      });
    }
  }

  /**
   * DELETE: Elimina un juego de Firebase tras confirmar con el usuario.
   * @param juego Juego que se desea eliminar.
   */
  eliminar(juego: any): void {
    if (!confirm(`¿Seguro que deseas eliminar "${juego.nombre}"?`)) { return; }
    this.datosService.eliminarJuego(juego._pos).subscribe({
      next: () => {
        this.mensaje = '🗑️ Juego eliminado correctamente';
        this.cargarJuegos();
        this.limpiarMensaje();
      },
      error: () => { this.error = 'Error al eliminar el juego.'; this.cdr.detectChanges(); }
    });
  }

  /** Borra el mensaje de éxito luego de unos segundos. */
  limpiarMensaje(): void {
    setTimeout(() => { this.mensaje = ''; this.cdr.detectChanges(); }, 2500);
  }
}