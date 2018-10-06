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
  guia: any;
  user: any;
  tipos: any;

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
          this.user = data.user;
          
            let headers = new Headers();

            // Fetches the token of the currently logged in user from localStorage
            headers.append('Authorization', localStorage.getItem('id_token'));
            headers.append('Content-Type', 'application/json');

            //Metodo que busca los Roles, Estados e Informacion del Guia en la BD y los agrega al local storage         
              this.http.get('http://localhost:3000/users/login', { headers })
              .map(res => res.json())
              .subscribe(data => {
        
                this.roles = data.roles;
                this.estados = data.estados;
                this.tipos = data.tipos;

                localStorage.setItem('roles', JSON.stringify(data.roles));
                localStorage.setItem('estados', JSON.stringify(data.estados));
                localStorage.setItem('tipos', JSON.stringify(data.tipos));

                // Corrige error en el formato de la fecha
                let fecha = this.user.FechaNacimiento;
                let day = Number(fecha.slice(8, 10)) + 1;
                let dayString = day.toString();

                if (day < 10) {
                  dayString = '0' + day;
                }

                this.user.FechaNacimiento = this.datePipe.transform(fecha.slice(0, 8) + dayString + fecha.slice(10));
                this.user.Cargo = this.roles[parseInt(this.user.Rol)].Tipo;
                this.user.Edad = this.datePipe.transform(this.user.FechaNacimiento);

                localStorage.setItem('user', JSON.stringify(this.user));

                location.reload();
              }, err => {
                console.log('Error al pedir los datos de login: ', err);
                return false;
              });

          // Flash Message
          this.flashMessage.show(`¡Bienvenido, ${data.user.Nombre}!`, { cssClass: 'custom-success', timeout: 6000 });
          this.router.navigate(['dashboard']);
        } else {
          this.flashMessage.show(data.msg, { cssClass: 'custom-danger', timeout: 3000 });
          this.router.navigate(['login']);
        }
      });
  }

}
