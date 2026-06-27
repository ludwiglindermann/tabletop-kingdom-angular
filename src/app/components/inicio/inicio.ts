import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 *  Componente de la página principal de TableTop Kingdom. Muestra
 * el listado de categorías de juegos disponibles, cada una con su imagen y un
 * enlace hacia su sección correspondiente.
 */
@Component({
  selector: 'app-inicio',
  imports: [RouterLink, CommonModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class InicioComponent {

  categorias = [
    {
      id: 'estrategia',
      nombre: 'Estrategia',
      descripcion: 'Juegos de planificación y táctica',
      imagen: 'images/categoria-estrategia.jpg'
    },
    {
      id: 'familia',
      nombre: 'Familia',
      descripcion: 'Juegos para jugar en grupo',
      imagen: 'images/categoria-familia.jpg'
    },
    {
      id: 'cartas',
      nombre: 'Cartas',
      descripcion: 'Juegos de naipes y mazos',
      imagen: 'images/categoria-cartas.jpg'
    },
    {
      id: 'misterio',
      nombre: 'Misterio',
      descripcion: 'Juegos de deducción e investigación',
      imagen: 'images/categoria-misterio.jpg'
    }
  ];
}