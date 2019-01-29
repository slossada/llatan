import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-asignar-directores',
  templateUrl: './asignar-directores.component.html',
  styleUrls: ['./asignar-directores.component.css']
})
export class AsignarDirectoresComponent implements OnInit {

  directores: any;
  evento: any;
  alerta: any;
  user: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.directores = JSON.parse(localStorage.getItem('directores'));
    this.evento = JSON.parse(localStorage.getItem('detalle-evento'));
    this.user = JSON.parse(localStorage.getItem('user'));

  }

  asignarDirector(i) {
    this.alerta=true;
    this.directores[i].Estado = 2;
    this.directores[i].esDirector = true;
    localStorage.setItem('directores',JSON.stringify(this.directores));
  }

  quitarDirector(i) {
    this.alerta=true;
    this.directores[i].Estado = 1;
    this.directores[i].esDirector = false;
    localStorage.setItem('directores',JSON.stringify(this.directores));
  }

  regresar() {
    this.router.navigate(['detalle-evento']);
  }

  guardar() {
    this.alerta=false;
    localStorage.setItem('directores',JSON.stringify(this.directores));
    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

        let data = {
          Evento: JSON.parse(localStorage.getItem('detalle-evento')).id,
          directores: this.directores
        }
        // Hacer la petición, se retorna una promesa
        this.http.post('http://localhost:3000/users/guardar-directores', data, { headers })
        .map(res => res.json())
        .subscribe(response => {
          if (response.success) {
            this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
          } else {
            this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
          }
        });
      
  }

  verPerfil(i) {
    localStorage.setItem('regresar' ,'asignar-directores')
    localStorage.setItem('perfil-guia', this.directores[i].id);
    this.router.navigate(['perfil-guia']);
  }

}
 