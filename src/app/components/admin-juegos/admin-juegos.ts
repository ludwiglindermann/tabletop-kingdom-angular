import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Datos } from '../../services/datos';

/**
 * Componente de administración de juegos. Permite al administrador realizar las
 * operaciones CRUD sobre los juegos almacenados en Firebase: listar (GET),
 * crear (POST), editar (PUT) y eliminar (DELETE). Incluye validación de los
 * campos antes de guardar. Solo es accesible para usuarios con rol de administrador.
 */
@Component({
  selector: 'app-admin-juegos',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './admin-juegos.html',
  styleUrl: './admin-juegos.css'
})
export class AdminJuegosComponent implements OnInit {

  /** Lista de juegos que se muestran en la tabla (con su clave en Firebase). */
  juegos: any[] = [];

  /** Indica si los datos aún se están cargando. */
  cargando: boolean = true;

  /** Mensaje de error en caso de fallo. */
  error: string = '';

  /** Mensaje de éxito tras una operación. */
  mensaje: string = '';

  /** Mensaje de error de validación del formulario. */
  errorValidacion: string = '';

  /** Controla si el formulario de crear/editar está visible. */
  mostrarFormulario: boolean = false;

  /** Indica si el formulario está en modo edición (true) o creación (false). */
  modoEdicion: boolean = false;

  /** Clave (numérica o de Firebase) del juego que se está editando. */
  claveEditando: any = null;

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
   * GET: Carga todos los juegos desde Firebase. Guarda la clave de cada juego
   * (sea numérica o de texto) para poder editarlo o eliminarlo después.
   */
  cargarJuegos(): void {
    this.datosService.getJuegos().subscribe({
      next: (datos) => {
        this.juegos = [];
        if (datos) {
          Object.keys(datos).forEach((clave: string) => {
            if (datos[clave] !== null) {
              this.juegos.push({ ...datos[clave], _clave: clave });
            }
          });
        }
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
    this.errorValidacion = '';
    this.juegoForm = this.formVacio();
    this.mostrarFormulario = true;
  }

  /**
   * Abre el formulario en modo edición, cargando los datos del juego elegido.
   * @param juego Juego que se desea editar.
   */
  abrirEditar(juego: any): void {
    this.modoEdicion = true;
    this.errorValidacion = '';
    this.claveEditando = juego._clave;
    this.juegoForm = { ...juego };
    this.mostrarFormulario = true;
  }

  /** Cierra el formulario sin guardar. */
  cancelar(): void {
    this.mostrarFormulario = false;
    this.errorValidacion = '';
  }

  /**
   * Valida los campos del formulario antes de guardar. Comprueba que el nombre,
   * la descripción y la imagen no estén vacíos, y que el precio sea mayor a 0.
   * @returns true si todos los campos son válidos; false en caso contrario.
   */
  validarFormulario(): boolean {
    const f = this.juegoForm;
    if (!f.nombre || f.nombre.trim() === '') {
      this.errorValidacion = 'El nombre es obligatorio.';
      return false;
    }
    if (!f.descripcion || f.descripcion.trim() === '') {
      this.errorValidacion = 'La descripción es obligatoria.';
      return false;
    }
    if (!f.imagen || f.imagen.trim() === '') {
      this.errorValidacion = 'La ruta de la imagen es obligatoria.';
      return false;
    }
    if (f.precio === null || f.precio === undefined || Number(f.precio) <= 0) {
      this.errorValidacion = 'El precio debe ser un número mayor a 0.';
      return false;
    }
    this.errorValidacion = '';
    return true;
  }

  /**
   * Guarda el juego del formulario. Valida primero los campos. Si está en modo
   * edición usa PUT (actualizar); si está en modo creación usa POST (crear).
   */
  guardar(): void {
    if (!this.validarFormulario()) {
      this.cdr.detectChanges();
      return;
    }

    const juego = {
      id: Number(this.juegoForm.id) || 0,
      nombre: this.juegoForm.nombre.trim(),
      categoria: this.juegoForm.categoria,
      descripcion: this.juegoForm.descripcion.trim(),
      precio: Number(this.juegoForm.precio),
      descuento: this.juegoForm.descuento,
      imagen: this.juegoForm.imagen.trim()
    };

    if (this.modoEdicion) {
      this.datosService.actualizarJuego(this.claveEditando, juego).subscribe({
        next: () => {
          this.mensaje = '✅ Juego actualizado correctamente';
          this.mostrarFormulario = false;
          this.cargarJuegos();
          this.limpiarMensaje();
        },
        error: () => { this.error = 'Error al actualizar el juego.'; this.cdr.detectChanges(); }
      });
    } else {
      this.datosService.crearJuego(juego).subscribe({
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
    this.datosService.eliminarJuego(juego._clave).subscribe({
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