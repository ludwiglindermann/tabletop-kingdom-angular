import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Datos } from '../../services/datos';

/**
 * Componente de la página principal de TableTop Kingdom. Muestra el listado de
 * categorías de juegos disponibles, que ahora se cargan dinámicamente desde un
 * archivo JSON a través del servicio Datos.
 */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent implements OnInit {

  /** Lista de categorías recibidas desde el archivo JSON. */
  categorias: any[] = [];

  /** Indica si los datos aún se están cargando. */
  cargando: boolean = true;

  /** Mensaje de error en caso de que falle la carga de datos. */
  error: string = '';

  constructor(private datosService: Datos, private cdr: ChangeDetectorRef) { }

  /**
   * Al iniciar el componente, solicita las categorías al servicio y las guarda
   * para mostrarlas en la vista. Controla los estados de carga y error, y
   * actualiza la vista cuando los datos llegan.
   */
  ngOnInit(): void {
    this.datosService.getCategorias().subscribe({
      next: (datos) => {
        this.categorias = datos;
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.error = 'No se pudieron cargar las categorías.';
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }
}