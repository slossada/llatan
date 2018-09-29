import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-lista-eventos',
  templateUrl: './lista-eventos.component.html',
  styleUrls: ['./lista-eventos.component.css']
})
export class ListaEventosComponent implements OnInit {

  mostrar_lista: boolean;
  eventos: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    let headers = new Headers();

    // Busca el token del usuario que esta ingresado en el sistema actualmente
    const token = localStorage.getItem('id_token');

    // Settear los encabezados para la petición al API
    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:3000/users/eventos', { headers })
      .map(res => res.json())
      .subscribe(data => {
        data.eventos.map(evento => {
          if (evento.FechaInicio || evento.FechaFin) {
            // Guarda la fecha formateada
            evento.FechaInicio = this.datePipe.transform(evento.FechaInicio);
            evento.FechaFin = this.datePipe.transform(evento.FechaFin);
          }
        });

        this.eventos = data.eventos;

        localStorage.setItem('eventos', JSON.stringify(data.eventos));
      }, err => {
        console.log('Error al pedir los eventos: ', err);
        return false;
      });

  }

}
