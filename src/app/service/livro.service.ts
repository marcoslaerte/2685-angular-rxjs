import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { Item, LivrosResultado } from '../models/interfaces';

@Injectable({
  providedIn: 'root'
})
export class LivroService {

  private readonly API = 'https://www.googleapis.com/books/v1/volume'

  constructor(private http: HttpClient) { }

  buscar(valorDigitado: string): Observable<Item[]> {
    const params = new HttpParams().append('q', valorDigitado);
    return this.http.get<LivrosResultado>(this.API, { params })
      .pipe(
        //tap(retornoAPI => console.log('Fluxo do tap', retornoAPI)), // tap: utilizado para debbuging e não modifica o Observable.
        map(resultado => resultado.items), // map: Operador de transformação. Transforma o observable em um novo de acordo com a função passada.
        //tap(resultado => console.log('Fluxo após map', resultado)),
      );
  }

}
