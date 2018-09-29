import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-form-eventos',
  templateUrl: './form-eventos.component.html',
  styleUrls: ['./form-eventos.component.css']
})
export class FormEventosComponent implements OnInit {

  tipo: any;
  nombre: any;
  detalle: any;
  fechaInicio: any;
  fechaFin: any;
  encargado: any;
  nombreEncargado: any;
  cupos: any;
  hay_encargado: boolean;
  mostrar_lista: boolean;
  guias: any;
  roles: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.roles = JSON.parse(localStorage.getItem('roles'));

    console.log(this.roles);

    let headers = new Headers();

    // Busca el token del usuario que esta ingresado en el sistema actualmente
    const token = localStorage.getItem('id_token');

    // Settear los encabezados para la petición al API
    headers.append('Authorization', token);
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:3000/users/coordis-y-baquianos', { headers })
      .map(res => res.json())
      .subscribe(data => {
        data.guias.map(guia => {
          if (guia.FechaNacimiento) {
            // Guarda la fecha formateada
            guia.FechaNacimiento = this.datePipe.transform(guia.FechaNacimiento);
          }
        });

        this.guias = data.guias;

        localStorage.setItem('guias', JSON.stringify(data.guias));
      }, err => {
        console.log('Error al pedir los guias: ', err);
        return false;
      });

  }

  registrarEvento(){
    // // Valida que no se haya dejado ninguna casilla vacia
    if (this.faltaAlgunaCasilla()) {
      this.flashMessage.show('Por favor, llene todas las casillas.', { cssClass: 'custom-danger', timeout: 5000 });
      return false;
    }

    // Convertimos el string de la cantidad a un entero
    const cupos = Number(this.cupos);

    const data = {
      Tipo: this.tipo,
      Nombre: this.nombre,
      Detalle: this.detalle,
      FechaInicio: this.fechaInicio,
      FechaFin: this.fechaFin,
      Encargado: this.encargado,
      Cupos: cupos,
    }

    // Settear los encabezados para la petición al API
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('http://localhost:3000/users/crear-evento', data, { headers })
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
          this.router.navigate(['/lista-eventos']);
        } else {
          this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
          this.router.navigate(['/form-eventos']);
        }
      });    
  }

  asignar(id){
    this.encargado = this.guias[id].id;
    this.nombreEncargado = this.guias[id].Nombre+' '+this.guias[id].Apellido;
    this.hay_encargado = true;
    this.mostrar_lista = false;
  }

  asignarEncargado(){
    this.mostrar_lista = true;
    this.hay_encargado = false;
  }

  // Funcion que retorna false si alguna casilla ha dejado de llenarse
  faltaAlgunaCasilla() {
    return (
      this.tipo === undefined || 
      this.tipo === '' || 
      this.nombre === undefined || 
      this.nombre === '' || 
      this.cupos === undefined || 
      this.cupos === '' || 
      this.fechaInicio === undefined ||
      this.fechaInicio === '' ||
      this.fechaFin === undefined ||
      this.fechaFin === '' ||
      this.detalle === undefined ||
      this.detalle === ''
    );
  }

}
