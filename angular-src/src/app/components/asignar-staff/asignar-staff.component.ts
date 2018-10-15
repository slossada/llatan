import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-asignar-staff',
  templateUrl: './asignar-staff.component.html',
  styleUrls: ['./asignar-staff.component.css']
})
export class AsignarStaffComponent implements OnInit {

  guias: any;
  roles: any;
  alerta: any;
  evento: any;
  user: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.guias = JSON.parse(localStorage.getItem('guias'));
    this.roles = JSON.parse(localStorage.getItem('roles'));    
    this.evento = JSON.parse(localStorage.getItem('detalle-evento'));
    this.user = JSON.parse(localStorage.getItem('user'));

  }

  asignarGuias(i) {
    this.alerta=true;
    this.guias[i].Estado = 2;
    localStorage.setItem('guias',JSON.stringify(this.guias));
  }

  quitarGuias(i) {
    this.alerta=true;
    this.guias[i].Estado = 1;
    localStorage.setItem('guias',JSON.stringify(this.guias));
  }

  regresar() {
    this.router.navigate(['detalle-evento']);
  }

  guardar() {
    this.alerta=false;
    localStorage.setItem('guias',JSON.stringify(this.guias));
    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

        let data = {
          Evento: JSON.parse(localStorage.getItem('detalle-evento')).id,
          guias: this.guias
        }
        // Hacer la petición, se retorna una promesa
        this.http.post('http://localhost:3000/users/guardar-guias', data, { headers })
        .map(res => res.json())
        .subscribe(response => {
          if (response.success) {
            this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
          } else {
            this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
          }
        });

  }

}
