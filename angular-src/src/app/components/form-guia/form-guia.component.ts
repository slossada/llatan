import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-form-guia',
  templateUrl: './form-guia.component.html',
  styleUrls: ['./form-guia.component.css']
})
export class FormGuiaComponent implements OnInit {

  sexo: string;
  fechaNacimiento: string;
  anoIngreso: string;
  sobreNombre: string;
  rol: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  agregarDatos() {

    // Validacion de las Casillas
    if (this.sexo == undefined || this.fechaNacimiento == undefined || this.anoIngreso == undefined || this.rol == undefined) {
      this.flashMessage.show('Por favor llene todas las casillas.', { cssClass: 'custom-danger', timeout: 5000 });
      return false;
    }

    // Validar de la Fecha de Nacimiento
    if (new Date(this.fechaNacimiento) > new Date()) {
      this.flashMessage.show('La fecha ingresada es invalida.', { cssClass: 'custom-danger', timeout: 5000 });
      return false;
    }

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

    let data = {
      id: JSON.parse(localStorage.getItem('user')).id,
      sexo: this.sexo,
      fechaNacimiento: this.fechaNacimiento,
      anoIngreso: this.anoIngreso,
      rol: this.rol,
      sobreNombre: this.sobreNombre
    };

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('users/datos-guia', data, { headers })
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
          this.router.navigate(['/profile']);
        } else {
          this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
          this.router.navigate(['/form-guia']);
        }
    });
  }

}
