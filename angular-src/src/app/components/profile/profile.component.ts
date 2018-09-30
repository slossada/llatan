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

  user: object;
  sexo: string;
  fechaNacimiento: string;
  anoIngreso: string;
  sobreNombre: string;
  rol: string;
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

    let headers = new Headers();

    // Fetches the token of the currently logged in user from localStorage
    
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:3000/users/profile', { headers })
      .map(res => res.json())
      .subscribe(profile => {
        this.user = profile.user;

        if (profile.user.sexo != undefined && profile.user.fechaNacimiento != undefined && profile.user.sobreNombre != undefined && profile.user.anoIngreso != undefined && profile.user.rol != undefined) {

          // Corrige error en el formato de la fecha
          let fecha = profile.user.fechaNacimiento;
          let day = Number(fecha.slice(8, 10)) + 1;
          let dayString = day.toString();

          if (day < 10) {
            dayString = '0' + day;
          }

          // Guarda la fecha formateada
          this.fechaNacimiento = this.datePipe.transform(fecha.slice(0, 8) + dayString + fecha.slice(10));

          this.sexo = profile.user.sexo;
          this.sobreNombre = profile.user.sobreNombre;
          this.anoIngreso = profile.user.anoIngreso;
          this.rol = profile.user.rol;
        }

      }, err => {
        console.log('Error while getting the profile in ProfileComponent: ', err);
        return false;
      });

      this.http.get('http://localhost:3000/users/mis-eventos', { headers })
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
      id_Guia: JSON.parse(localStorage.getItem('user')).id,
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

  completoFormulario() {
    return this.fechaNacimiento && this.sexo && this.anoIngreso && this.rol;
  }
}
