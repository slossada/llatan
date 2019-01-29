import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;
  roles: any;
  rol: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {
    
    this.user = JSON.parse(localStorage.getItem('user')); 
    this.rol = this.user.rol;
    this.roles = JSON.parse(localStorage.getItem('roles'));

    // let headers = new Headers();

    // // Fetches the token of the currently logged in user from localStorage
    // headers.append('Authorization', localStorage.getItem('id_token'));
    // headers.append('Content-Type', 'application/json');

    // // Metodo que se jala la información del guia
    // this.http.get('http://localhost:3000/users/profile', { headers })
    // .map(res => res.json())
    // .subscribe(profile => {
    //   let user = JSON.parse(localStorage.getItem('user'));

    //   if (profile.user.sexo != undefined && profile.user.fechaNacimiento != undefined && profile.user.sobreNombre != undefined && profile.user.anoIngreso != undefined && profile.user.rol != undefined) {

    //     user.edad = this.datePipe.transform(profile.user.fechaNacimiento);

    //     // Corrige error en el formato de la fecha
    //     let fecha = profile.user.fechaNacimiento;
    //     let day = Number(fecha.slice(8, 10)) + 1;
    //     let dayString = day.toString();

    //     if (day < 10) {
    //       dayString = '0' + day;
    //     }

    //     user.fechaNacimiento = this.datePipe.transform(fecha.slice(0, 8) + dayString + fecha.slice(10));
    //     user.sexo = profile.user.sexo;
    //     user.sobreNombre = profile.user.sobreNombre;
    //     user.anoIngreso = profile.user.anoIngreso;
    //     user.rol = profile.user.rol;
    //     console.log(user.rol);
    //     console.log(this.roles);
    //     user.cargo = this.roles[parseInt(profile.user.rol)].Tipo;
    //     console.log(user.cargo);

    //     localStorage.setItem('user', JSON.stringify(user));
    //   }

    // }, err => {
    //   console.log('Error while getting the profile in ProfileComponent: ', err);
    //   return false;
    // });

  }

}
