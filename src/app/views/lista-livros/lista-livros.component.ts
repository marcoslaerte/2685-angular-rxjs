import { FormControl } from '@angular/forms';
import { Item } from './../../models/interfaces';
import { Component } from '@angular/core';
import { filter, map, switchMap, tap } from 'rxjs';
import { LivroVolumeInfo } from 'src/app/models/livroVolumeInfo';
import { LivroService } from 'src/app/service/livro.service';

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
      filter((valorDigitado) => valorDigitado.length >= 3),
      tap(() => console.log('Fluxo Inicial')),
      switchMap((valorDigitado) => this.service.buscar(valorDigitado)), //SwitchMap descarta os valores anteriores (os primeiros caracteres digitados) e envia somente o valor integral (ou seja, a palavra inteira).
      tap(() => console.log('Requisições ao servidor')),
      map((items) => this.livrosResultadoParaLivros(items))
    )

  livrosResultadoParaLivros(items: Item[]): LivroVolumeInfo[] {
    return items.map(item => {
      return new LivroVolumeInfo(item)
    });
  }

}



