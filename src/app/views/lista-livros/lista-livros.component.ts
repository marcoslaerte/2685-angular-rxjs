import { FormControl } from '@angular/forms';
import { Item } from './../../models/interfaces';
import { Component } from '@angular/core';
import { debounceTime, filter, map, switchMap, tap } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

const PAUSA = 300;

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent {

  campoBusca = new FormControl();

  constructor(private service: LivroService) { }

  livrosEncontrados$ = this.campoBusca.valueChanges
    .pipe(
      debounceTime(PAUSA), //Delay de espera após o usuário terminar de digitar para não efetuar busca antes dele completar a palavra de busca
      filter((valorDigitado) => valorDigitado.length >= 3), //Pesquisa somente após o usuário digitar pelo menos 3 caracteres
      tap(() => console.log('Fluxo Inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)), //SwitchMap descarta os valores anteriores (os primeiros caracteres digitados) e envia somente o valor integral (ou seja, a palavra inteira).
      tap((retornoAPI) => console.log(retornoAPI)),
      map((items) => this.livrosResultadoParaLivros(items))
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }

}



