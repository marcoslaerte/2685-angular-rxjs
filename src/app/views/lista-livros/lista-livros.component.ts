import { FormControl } from '@angular/forms';
import { Component } from '@angular/core';
import { catchError, debounceTime, distinctUntilChanged, EMPTY, filter, map, of, switchMap, tap, throwError } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';
import { Item, LivrosResultado } from 'src/app/models/interfaces';
import { trigger, transition, query, style, stagger, animate, keyframes } from '@angular/animations';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css'],
  animations: [
    trigger('listAnimation', [
      transition('* <=> *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(-50px)' }),
          stagger('100ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 0, transform: 'translateY(-50px)', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
              style({ opacity: 1, transform: 'none', offset: 1 }),
            ])),
          ]),
        ], { optional: true }),
        query(':leave', [
          stagger('100ms', [
            animate('500ms ease-out', keyframes([
              style({ opacity: 1, transform: 'none', offset: 0 }),
              style({ opacity: 0.5, transform: 'translateY(-25px)', offset: 0.3 }),
              style({ opacity: 0, transform: 'translateY(-50px)', offset: 1 }),
            ])),
          ]),
        ], { optional: true }),
      ]),
    ]),
  ]
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();
  mensagemErro = '';
  livrosResultado: LivrosResultado;

  constructor(private service: LivroService) { }

  // totalDeLivros$ = this.campoBusca.valueChanges
  //   .pipe(
  //     debounceTime(PAUSA),
  //     filter((valorDigitado) => valorDigitado.length >= 3),
  //     tap(() => console.log('Fluxo Inicial')),
  //     switchMap((valorDigitado) => this.service.buscar(valorDigitado)),
  //     map(resultado => this.livrosResultado = resultado),
  //     catchError(erro => {
  //       console.log(erro)
  //       return of()
  //     })
  //   );

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA), //Delay de espera após o usuário terminar de digitar para não efetuar busca antes dele completar a palavra de busca
      filter((valorDigitado) => valorDigitado.length >= 3), //Pesquisa somente após o usuário digitar pelo menos 3 caracteres
      tap(() => console.log('Fluxo Inicial')),
      distinctUntilChanged(),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)), //SwitchMap descarta os valores anteriores (os primeiros caracteres digitados) e envia somente o valor integral (ou seja, a palavra inteira).
      tap((retornoAPI) => console.log(retornoAPI)),
      map(resultado => resultado.items ?? []), // Se existir itens, retorna os itens. Senão, retorna uma lista vazia.
      map((items) => this.livrosResultadoParaLivros(items)),
      // catchError(() => {
      //   this.mensagemErro = "Ops, ocorreu um erro! Recarregue a aplicação.";
      //   return EMPTY;
      // })
      catchError(erro => {
        console.log(erro);
        return throwError(() => new Error(this.mensagemErro = "Ops, ocorreu um erro! Recarregue a aplicação."));
      })
    );

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }

}



