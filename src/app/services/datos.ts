import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/**
 * Servicio encargado de consumir los datos de la aplicación desde archivos
 * JSON locales ubicados en la carpeta public/data. Utiliza HttpClient para
 * realizar las peticiones y devuelve los datos como observables.
 */
@Injectable({
  providedIn: 'root'
})
export class Datos {

  private urlCategorias = 'data/categorias.json';
  private urlJuegos = 'data/juegos.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista de categorías desde el archivo categorias.json.
   * @returns Un observable con el arreglo de categorías.
   */
  getCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.urlCategorias);
  }

  /**
   * Obtiene el conjunto de categorías con sus juegos desde el archivo juegos.json.
   * @returns Un observable con el objeto que contiene los juegos por categoría.
   */
  getJuegos(): Observable<any> {
    return this.http.get<any>(this.urlJuegos);
  }
}