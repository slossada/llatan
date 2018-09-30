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
    private router: Router,
    private flashMessage: FlashMessagesService
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

            //Metodo que buscar los Roles y Estados en la BD y los agrega al local storage
              let headers = new Headers();
          
              // Settear los encabezados para la petición al API
              headers.append('Authorization', localStorage.getItem('id_token'));
              headers.append('Content-Type', 'application/json');
          
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
