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

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.directores = JSON.parse(localStorage.getItem('directores'));

  }

  asignarDirector(i) {
    this.directores[i].Direcciona = true;
    localStorage.setItem('directores',JSON.stringify(this.directores));
  }

  quitarDirector(i) {
    this.directores[i].Direcciona = false;
    localStorage.setItem('directores',JSON.stringify(this.directores));
  }

  regresar() {
    this.router.navigate(['detalle-evento']);
  }

  guardar() {
    localStorage.setItem('directores',JSON.stringify(this.directores));
    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    for (let i = 0; i < this.directores.length; i++) {

        let data = {
          Evento: JSON.parse(localStorage.getItem('detalle-evento')).id,
          Guia: this.directores[i].id,
          Tipo: this.directores[i].Direcciona
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
          document.location.reload();
        });
      
    }
  }

}
 