import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  username: String;
  password: String;
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
  }

  onLoginSubmit() {
    const user = {
      username: this.username,
      password: this.password
    };

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:3000/users/authenticate', user, { headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.success) {
          // Store user data
          localStorage.setItem('id_token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
            let headers = new Headers();
            // Fetches the token of the currently logged in user from localStorage
            headers.append('Authorization', localStorage.getItem('id_token'));
            headers.append('Content-Type', 'application/json');

            //Metodo que buscar los Roles y Estados en la BD y los agrega al local storage         
              this.http.get('http://localhost:3000/users/roles', { headers })
              .map(res => res.json())
              .subscribe(data => {
        
                this.roles = data.roles;

                localStorage.setItem('roles', JSON.stringify(data.roles));
              }, err => {
                console.log('Error al pedir los roles: ', err);
                return false;
              });

              this.http.get('http://localhost:3000/users/estados', { headers })
              .map(res => res.json())
              .subscribe(data => {
        
                this.estados = data.estados;
        
                localStorage.setItem('estados', JSON.stringify(data.estados));
              }, err => {
                console.log('Error al pedir los estados: ', err);
                return false;
              });
          
            // Metodo que se jala la información del guia
              this.http.get('http://localhost:3000/users/profile', { headers })
              .map(res => res.json())
              .subscribe(profile => {
                let user = JSON.parse(localStorage.getItem('user'));
        
                if (profile.user.sexo != undefined && profile.user.fechaNacimiento != undefined && profile.user.sobreNombre != undefined && profile.user.anoIngreso != undefined && profile.user.rol != undefined) {
        
                  user.edad = this.datePipe.transform(profile.user.fechaNacimiento);
        
                  // Corrige error en el formato de la fecha
                  let fecha = profile.user.fechaNacimiento;
                  let day = Number(fecha.slice(8, 10)) + 1;
                  let dayString = day.toString();
        
                  if (day < 10) {
                    dayString = '0' + day;
                  }
        
                  user.fechaNacimiento = this.datePipe.transform(fecha.slice(0, 8) + dayString + fecha.slice(10));
                  user.sexo = profile.user.sexo;
                  user.sobreNombre = profile.user.sobreNombre;
                  user.anoIngreso = profile.user.anoIngreso;
                  user.rol = profile.user.rol;
                  user.cargo = this.roles[parseInt(profile.user.rol)].Tipo;

                  localStorage.setItem('user', JSON.stringify(user));
                }
        
              }, err => {
                console.log('Error while getting the profile in ProfileComponent: ', err);
                return false;
              });

          // Flash Message
          this.flashMessage.show(`¡Bienvenido, ${data.user.nombre}!`, { cssClass: 'custom-success', timeout: 6000 });
          this.router.navigate(['dashboard']);
        } else {
          this.flashMessage.show(data.msg, { cssClass: 'custom-danger', timeout: 3000 });
          this.router.navigate(['login']);
        }
      });
  }

}
