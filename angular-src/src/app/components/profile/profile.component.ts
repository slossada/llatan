import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
 
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  mis_eventos: any;
  estados: any;
  roles: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.estados = JSON.parse(localStorage.getItem('estados'));
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.user = JSON.parse(localStorage.getItem('user'));

    let headers = new Headers();

    // Fetches the token of the currently logged in user from localStorage
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    this.http.get('users/mis-eventos', { headers })
    .map(res => res.json())
    .subscribe(data => {
      data.eventos.map(evento => {
        if (evento.FechaInicio || evento.FechaFin) {
          // Guarda la fecha formateada
          evento.FechaInicio = this.datePipe.transform(evento.FechaInicio);
          evento.FechaFin = this.datePipe.transform(evento.FechaFin);
        }
      });

      this.mis_eventos = data.eventos;

      localStorage.setItem('mis-eventos', JSON.stringify(data.eventos));
    }, err => {
      console.log('Error al pedir los eventos: ', err);
      return false;
    });
  }

  marcarDisponibilidad(i,tipo) {
    let id_Evento = this.mis_eventos[i].id;
    let id_Estado = tipo;

    let data = {
      id_Evento: id_Evento,
      id_Guia: this.user.id,
      id_Estado: id_Estado
    };

    this.mis_eventos[i].Estado = id_Estado;
    localStorage.setItem('eventos', JSON.stringify(this.mis_eventos));

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('users/marcar-disponibilidad', data, { headers })
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
    let evento = this.mis_eventos[i];
    localStorage.setItem('detalle-evento', JSON.stringify(evento));
    localStorage.setItem('regresar', 'profile');
    this.router.navigate(['detalle-evento']);
  }
}
