import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-config-eventos',
  templateUrl: './config-eventos.component.html',
  styleUrls: ['./config-eventos.component.css']
})
export class ConfigEventosComponent implements OnInit {

  eventos: any;
  estados: any;
  guias: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.estados = JSON.parse(localStorage.getItem('estados'));

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

  verDetalle(i) {
    let evento = this.eventos[i];
    localStorage.setItem('detalle-evento', JSON.stringify(evento));
    localStorage.setItem('regresar', 'config-eventos');
    this.router.navigate(['detalle-evento']);
  }

}
