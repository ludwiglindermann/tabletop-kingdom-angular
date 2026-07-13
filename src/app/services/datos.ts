import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de consumir y manipular los datos de la aplicación desde
 * la base de datos Realtime Database de Firebase mediante una API REST.
 * Implementa las operaciones CRUD (GET, POST, PUT y DELETE) usando HttpClient.
 */
@Injectable({
  providedIn: 'root'
})
export class Datos {

  /** URL base de la Realtime Database de Firebase. */
  private urlBase = 'https://tabletop-kingdom-ludwig-default-rtdb.firebaseio.com';

  /** URL local del archivo de categorías (se mantiene para el listado de categorías). */
  private urlCategorias = 'data/categorias.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de categorías desde el archivo categorias.json local.
   * @returns Un observable con el arreglo de categorías.
   */
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.urlCategorias);
  }

  /**
   * GET: Obtiene todos los juegos almacenados en Firebase.
   * @returns Un observable con la lista de juegos.
   */
  getJuegos(): Observable<any> {
    return this.http.get<any>(`${this.urlBase}/juegos.json`);
  }

  /**
   * POST: Crea un nuevo juego en Firebase, agregándolo al final de la lista.
   * @param juego Objeto del juego que se desea crear.
   * @param posicion Índice donde se guardará el nuevo juego.
   * @returns Un observable con la respuesta de Firebase.
   */
  crearJuego(juego: any, posicion: number): Observable<any> {
    return this.http.put<any>(`${this.urlBase}/juegos/${posicion}.json`, juego);
  }

  /**
   * PUT: Actualiza un juego existente en Firebase según su posición.
   * @param posicion Índice del juego que se desea modificar.
   * @param juego Objeto del juego con los datos actualizados.
   * @returns Un observable con la respuesta de Firebase.
   */
  actualizarJuego(posicion: number, juego: any): Observable<any> {
    return this.http.put<any>(`${this.urlBase}/juegos/${posicion}.json`, juego);
  }

  /**
   * DELETE: Elimina un juego de Firebase según su posición.
   * @param posicion Índice del juego que se desea eliminar.
   * @returns Un observable con la respuesta de Firebase.
   */
  eliminarJuego(posicion: number): Observable<any> {
    return this.http.delete<any>(`${this.urlBase}/juegos/${posicion}.json`);
  }
}