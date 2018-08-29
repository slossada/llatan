import { Component, OnInit } from '@angular/core';
import { FlashMessagesService } from 'angular2-flash-messages';

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
    private flashMessage: FlashMessagesService
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
      this.flashMessage.show('Por favor llene todas las casillas.', { cssClass: 'alert-danger', timeout: 3000 });
      return false;
    }

    // Validate Email
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(user.email.toLowerCase())) {
      this.flashMessage.show('Por favor ingrese una dirección de correo válida.', { cssClass: 'alert-danger', timeout: 5000 });
      return false;
    }
  }

}
