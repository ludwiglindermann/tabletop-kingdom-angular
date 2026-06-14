import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categorias',
  imports: [RouterLink, CommonModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class CategoriasComponent {

  categoriaActual: string = '';
  mensajeAgregado: string = '';

  todasLasCategorias: any = {
    estrategia: {
      nombre: 'Estrategia 🧠',
      descripcion: 'Pon a prueba tu mente con estos juegos de planificación y táctica.',
      juegos: [
        {
          nombre: 'Catan',
          descripcion: 'Construye asentamientos, recolecta recursos y domina la isla de Catan antes que tus rivales.',
          precio: '$24.990',
          descuento: true,
          textoDescuento: '🔥 10% descuento',
          imagen: 'images/juego-catan.jpg'
        },
        {
          nombre: 'Pandemic',
          descripcion: 'Trabaja en equipo para detener la propagación de enfermedades mortales alrededor del mundo.',
          precio: '$29.990',
          descuento: false,
          textoDescuento: '',
          imagen: 'images/juego-pandemic.jpg'
        },
        {
          nombre: 'Ticket to Ride',
          descripcion: 'Conecta ciudades con rutas de tren y acumula puntos antes de que tus oponentes bloqueen el camino.',
          precio: '$27.490',
          descuento: true,
          textoDescuento: '🔥 15% descuento',
          imagen: 'images/juego-ticket.jpg'
        }
      ]
    },
    familia: {
      nombre: 'Familia 🎲',
      descripcion: 'Diversión garantizada para toda la familia en cada reunión.',
      juegos: [
        {
          nombre: 'UNO',
          descripcion: 'El clásico juego de cartas donde debes deshacerte de todas tus cartas antes que los demás.',
          precio: '$7.990',
          descuento: true,
          textoDescuento: '🔥 20% descuento',
          imagen: 'images/juego-uno.jpg'
        },
        {
          nombre: 'Jenga',
          descripcion: 'Extrae bloques de madera sin derribar la torre. El clásico juego de pulso y concentración.',
          precio: '$9.990',
          descuento: false,
          textoDescuento: '',
          imagen: 'images/juego-jenga.jpg'
        },
        {
          nombre: 'Monopoly',
          descripcion: 'Compra propiedades, construye casas y hoteles, y arruina a tus oponentes.',
          precio: '$19.990',
          descuento: true,
          textoDescuento: '🔥 5% descuento',
          imagen: 'images/juego-monopoly.jpg'
        }
      ]
    },
    cartas: {
      nombre: 'Cartas 🃏',
      descripcion: 'Estrategia, suerte y habilidad en cada mazo.',
      juegos: [
        {
          nombre: 'Pokémon Cards',
          descripcion: 'Colecciona y batalla con cartas de tus Pokémon favoritos.',
          precio: '$14.990',
          descuento: true,
          textoDescuento: '🔥 10% descuento',
          imagen: 'images/juego-pokemon.jpg'
        },
        {
          nombre: 'Exploding Kittens',
          descripcion: 'Evita robar al gatito explosivo usando cartas de acción. Divertido y adictivo.',
          precio: '$16.990',
          descuento: false,
          textoDescuento: '',
          imagen: 'images/juego-kittens.jpg'
        },
        {
          nombre: 'Poker',
          descripcion: 'El clásico juego de cartas de apuestas y estrategia.',
          precio: '$12.990',
          descuento: true,
          textoDescuento: '🔥 12% descuento',
          imagen: 'images/juego-poker.jpg'
        }
      ]
    },
    misterio: {
      nombre: 'Misterio 🔍',
      descripcion: 'Investiga, deduce y resuelve los enigmas antes que nadie.',
      juegos: [
        {
          nombre: 'Cluedo',
          descripcion: 'Descubre quién cometió el crimen, con qué arma y en qué habitación.',
          precio: '$18.990',
          descuento: true,
          textoDescuento: '🔥 15% descuento',
          imagen: 'images/juego-cluedo.jpg'
        },
        {
          nombre: 'Dungeons & Dragons',
          descripcion: 'Embárcate en épicas aventuras de rol y fantasía.',
          precio: '$32.990',
          descuento: false,
          textoDescuento: '',
          imagen: 'images/juego-dragons.jpg'
        },
        {
          nombre: 'Codenames',
          descripcion: 'Dos equipos compiten para descubrir a sus agentes secretos usando pistas.',
          precio: '$26.490',
          descuento: true,
          textoDescuento: '🔥 8% descuento',
          imagen: 'images/juego-codenames.jpg'
        }
      ]
    }
  };

  categoriaData: any = null;

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.params.subscribe(params => {
      this.categoriaActual = params['id'];
      this.categoriaData = this.todasLasCategorias[this.categoriaActual];
    });
  }

  agregarAlCarrito(juego: any) {
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