import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

// HTTP Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  nombre: String;
  seg_nombre: String;
  apellido: String;
  cedula: String;
  email: String;
  username: String;
  password: String;

  constructor(
    private flashMessage: FlashMessagesService,
    private http: Http,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    const user = {
      nombre: this.nombre,
      seg_nombre: this.seg_nombre,
      apellido: this.apellido,
      cedula: this.cedula,
      email: this.email,
      username: this.username,
      password: this.password
    }

    // Require all fields
    if (user.nombre == undefined || user.apellido == undefined || user.cedula == undefined || user.email == undefined || user.username == undefined || user.password == undefined) {
      this.flashMessage.show('Por favor llene todas las casillas.', { cssClass: 'custom-danger', timeout: 3000 });
      return false;
    }

    // Validate Email
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(user.email.toLowerCase())) {
      this.flashMessage.show('Por favor ingrese una dirección de correo válida.', { cssClass: 'custom-danger', timeout: 5000 });
      return false;
    }

    // Register User
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    this.http.post('http://localhost:3000/users/register', user, { headers: headers })
      .map(res => res.json())
      .subscribe(data => {
        if (data.success) {
          this.flashMessage.show('Usted fue registrado exitosamente.', { cssClass: 'custom-success', timeout: 3000 });
          this.router.navigate(['/login']);
        } else {
          this.flashMessage.show('Se produjo un error en su registro.', { cssClass: 'custom-danger', timeout: 3000 });
          this.router.navigate(['/register']);
        }
      });

  }

}
