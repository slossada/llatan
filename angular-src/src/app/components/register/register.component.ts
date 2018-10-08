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
  password2: String;
  sexo: string;
  fechaNacimiento: string;
  anoIngreso: string;
  sobreNombre: string;
  rol: any;
  alerta: any;

  constructor(
    private flashMessage: FlashMessagesService,
    private http: Http,
    private router: Router
  ) { }

  ngOnInit() {
  }

  onRegisterSubmit(){
    
    this.alerta = false;

    switch(this.rol) {
      case 'Senior':
        this.rol=1;
        break;
      case 'Guia':
        this.rol=2;
        break;
      case 'Baquiano':
        this.rol=3;
        break;
      case 'Coordinador':
        this.rol=4;
        break;
      default:
          true;
    }
    const user = {
      Nombre: this.nombre,
      Snombre: this.seg_nombre,
      Apellido: this.apellido,
      Cedula: this.cedula,
      Email: this.email,
      Username: this.username,
      Password: this.password,
      Sexo: this.sexo,
      FechaNacimiento: this.fechaNacimiento,
      AnoIngreso: this.anoIngreso,
      Rol: this.rol,
      SobreNombre: this.sobreNombre
    }

    // Check Password
    if ( this.password != this.password2) {
      this.flashMessage.show('Las contraseñas no coinciden.', { cssClass: 'custom-danger', timeout: 3000 });
      this.alerta = true;
      return false;
    }

    // Require all fields
    if (user.Nombre == undefined || user.Apellido == undefined || user.Cedula == undefined || user.Email == undefined || user.Username == undefined || user.Password == undefined || user.Sexo == undefined || user.FechaNacimiento == undefined || user.AnoIngreso == undefined || user.Rol == undefined) {
      this.flashMessage.show('Por favor llene todas las casillas.', { cssClass: 'custom-danger', timeout: 3000 });
      return false;
    }

    // Validate Email
    const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!regex.test(user.Email.toLowerCase())) {
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
          this.flashMessage.show('Se produjo un error en su registro. Verifique sus datos y su cedula de identidad.', { cssClass: 'custom-danger', timeout: 3000 });
          this.router.navigate(['/register']);
        }
      });

  }

}
