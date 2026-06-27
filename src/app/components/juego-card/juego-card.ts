import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente hijo que muestra la ficha de un juego (imagen, nombre, descripción,
 * precio y estado de descuento). Recibe los datos del juego desde el componente
 * padre mediante @Input, y notifica al padre cuando el usuario quiere agregarlo
 * al carrito mediante @Output.
 */
@Component({
  selector: 'app-juego-card',
  imports: [CommonModule],
  templateUrl: './juego-card.html',
  styleUrl: './juego-card.css'
})
export class JuegoCardComponent {

  /** Datos del juego recibidos desde el componente padre (categorías). */
  @Input() juego: any;

  /** Evento que notifica al componente padre que se desea agregar el juego al carrito. */
  @Output() agregar = new EventEmitter<any>();

  /**
   * Emite el evento 'agregar' hacia el componente padre, enviando el juego actual.
   */
  onAgregar() {
    this.agregar.emit(this.juego);
  }
}