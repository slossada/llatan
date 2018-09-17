import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

// HTTP Requests
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

  constructor(
    private http: Http,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

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
  }

  completoFormulario() {
    return this.fechaNacimiento && this.sexo && this.anoIngreso && this.rol;
  }
}
