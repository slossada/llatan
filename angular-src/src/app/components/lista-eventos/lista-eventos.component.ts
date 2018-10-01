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
  estados: any;
  id_Guia: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.id_Guia = JSON.parse(localStorage.getItem('user')).id;
    this.estados = JSON.parse(localStorage.getItem('estados'));

    if (localStorage.getItem('eventos')) {
      this.eventos = JSON.parse(localStorage.getItem('eventos'));
    }
    else {
      let headers = new Headers();

      // Settear los encabezados para la petición al API
      headers.append('Authorization', localStorage.getItem('id_token'));
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

  marcarDisponibilidad(i,tipo) {
    let id_Evento = this.eventos[i].id;
    let aux = false;
    let id_Estado = 1;

    if (tipo == 1) {
      aux = true;
    }
    if (tipo == 3) {
      id_Estado = 0;
    }

    let data = {
      new: aux,
      id_Evento: id_Evento,
      id_Guia: this.id_Guia,
      id_Estado: id_Estado
    };

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('http://localhost:3000/users/marcar-disponibilidad', data, { headers })
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
        } else {
          this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
        }
        document.location.reload();
    });
  }

}
