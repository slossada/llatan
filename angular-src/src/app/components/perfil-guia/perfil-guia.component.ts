import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-perfil-guia',
  templateUrl: './perfil-guia.component.html',
  styleUrls: ['./perfil-guia.component.css']
})
export class PerfilGuiaComponent implements OnInit {

  user: any;
  eventos: any;
  roles: any;
  estados: any;

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

    let data = {
      id_Guia: localStorage.getItem('perfil-guia'),
    };

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('http://localhost:3000/users/perfil-guia', data, { headers })
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
        this.user = data.user;

        var date = this.user.FechaNacimiento.slice(0,10);
        var dateArray = date.split("-");
        var rightNow = new Date();
        var res = rightNow.toISOString().slice(0,10).split("-");
        var edad =  parseInt(res[0]) - dateArray[0] -1;
        
        if ((parseInt(res[1]) > dateArray[1]) || (parseInt(res[1]) == dateArray[1] && parseInt(res[2]) >= dateArray[2])) {
          edad++;
        }
  
        this.user.Edad = edad;

        // Corrige error en el formato de la fecha
        let fecha = this.user.FechaNacimiento;
        let day = Number(fecha.slice(8, 10)) + 1;
        let dayString = day.toString();

        if (day < 10) {
          dayString = '0' + day;
        }

        this.user.FechaNacimiento = this.datePipe.transform(fecha.slice(0, 8) + dayString + fecha.slice(10));
        this.user.Cargo = this.roles[parseInt(this.user.Rol)].Tipo;

      }, err => {
        console.log('Error al pedir la informacion del guia: ', err);
        return false;
      });

  }

  botonRegresar() {
    let regresar = localStorage.getItem('regresar');
    this.router.navigate([regresar]);
  }

}
