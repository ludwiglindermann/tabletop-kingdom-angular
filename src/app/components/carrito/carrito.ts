import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  cargarCarrito() {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
    this.calcularTotal();
  }

  calcularTotal() {
    this.total = this.carrito.reduce((acc: number, item: any) => {
      const precio = parseInt(item.precio.replace(/\./g, '').replace('$', ''));
      return acc + precio * item.cantidad;
    }, 0);
  }

  eliminarItem(index: number) {
    this.carrito.splice(index, 1);
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.calcularTotal();
  }

  vaciarCarrito() {
    this.carrito = [];
    localStorage.setItem('carrito', JSON.stringify(this.carrito));
    this.total = 0;
  }

  simularPago() {
    this.mensajeExito = '¡Pago realizado con éxito! Gracias por tu compra 🎉';
    this.vaciarCarrito();
  }
}