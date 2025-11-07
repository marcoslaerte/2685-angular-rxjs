import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { LivroService } from 'src/app/service/livro.service';

@Component({
  selector: 'app-lista-livros',
  templateUrl: './lista-livros.component.html',
  styleUrls: ['./lista-livros.component.css']
})
export class ListaLivrosComponent implements OnDestroy {

  listaLivros: [];
  campoBusca: string = '';
  subscription: Subscription

  constructor(private service: LivroService) { }

  buscarLivros() {
    this.service.buscar(this.campoBusca).subscribe({
      next: retornoAPI => console.log(retornoAPI), //A notificação next pode ser emitida várias vezes.
      error: erro => console.log(erro), //o "error" (opcional): encerra o ciclo de vida do Observable. A notificação será emitida apenas uma vez.
      complete: () => console.log('Observable completado') //O "complete" (opcional) também encerra o ciclo de vida do Observable.  A notificação será emitida apenas uma vez.
    }
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}



