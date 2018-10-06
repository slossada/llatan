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

  user: any;
  mostrar_lista: boolean;
  eventos: any;
  estados: any;
  eliminar: any;
  alerta: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user'));
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

  marcarDisponibilidad(i,tipo) {
    let id_Evento = this.eventos[i].id;
    let id_Estado = tipo;

    let data = {
      id_Evento: id_Evento,
      id_Guia: this.user.id,
      id_Estado: id_Estado
    };

    this.eventos[i].Estado = id_Estado;
    localStorage.setItem('eventos', JSON.stringify(this.eventos));

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
    });
  }

  verDetalle(i) {
    let evento = this.eventos[i];
    localStorage.setItem('detalle-evento', JSON.stringify(evento));
    localStorage.setItem('regresar', 'lista-eventos');
    this.router.navigate(['detalle-evento']);
  }

  finalizarEvento(i) {
    this.eliminar = this.eventos[i];
    this.alerta = true;
  }

  botonesSiNo(i) {
    this.alerta = false;

    if (i) {
      let data = {
        id_Evento: this.eliminar.id,
      };

      let headers = new Headers();

      // Settear los encabezados para la petición al API
      headers.append('Authorization', localStorage.getItem('id_token'));
      headers.append('Content-Type', 'application/json');

      // Hacer la petición, se retorna una promesa
      this.http.post('http://localhost:3000/users/finalizar-evento', data, { headers })
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
    else {

    }
    
  }

}
