import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 *  Componente del carrito de compras. Muestra los juegos agregados,
 * calcula el total a pagar, permite eliminar productos o vaciar el carrito, y
 * simula el proceso de pago.
 */
@Component({
  selector: 'app-carrito',
  imports: [RouterLink, CommonModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css'
})
export class CarritoComponent {

  carrito: any[] = [];
  total: number = 0;
  mensajeExito: string = '';

  constructor(private router: Router) {
    this.cargarCarrito();
  }

  /**
   *  Carga los productos del carrito desde localStorage y recalcula
   * el total.
   */
  cargarCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.calcularTotal();
  }

  /**
   *  Calcula el total a pagar sumando el precio de cada juego
   * multiplicado por su cantidad.
   */
  calcularTotal() {
    this.total = this.carrito.reduce((acc: number, item: any) => {
      const precio = parseInt(item.precio.replace(/\./g, '').replace('$', ''));
      return acc + precio * item.cantidad;
    }, 0);
  }

  /**
   *  Elimina un producto del carrito según su posición y actualiza
   * el total.
   * @param index Posición del producto dentro del carrito.
   */
  eliminarItem(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.calcularTotal();
  }

  /**
   *  Vacía por completo el carrito de compras y reinicia el total.
   */
  vaciarCarrito() {
    this.carrito = [];
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.total = 0;
  }

  /**
   *  Simula el pago de la compra, muestra un mensaje de éxito y
   * vacía el carrito.
   */
  simularPago() {
    this.mensajeExito = '¡Pago realizado con éxito! Gracias por tu compra 🎉';
    this.vaciarCarrito();
  }
}