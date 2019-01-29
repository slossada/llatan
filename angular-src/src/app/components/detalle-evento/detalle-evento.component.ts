import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

// Http Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';
import { stringify } from 'querystring';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css']
})
export class DetalleEventoComponent implements OnInit {

  user: any;
  evento: any;
  estados: any;
  roles: any;
  tipo: any;
  nombre: any;
  detalle: any;
  fechaInicio: any;
  fechaFin: any;
  encargado: any;
  nombreEncargado: any;
  cupos: any;
  mostrar_lista: boolean;
  guias: any;
  tipos: any;
  coordis: any;
  directores: any;
  baquianos_coordis: any;
  staff: any;

  constructor(
    private http: Http,
    private authService: AuthService,
    private flashMessage: FlashMessagesService,
    private router: Router,
    private datePipe: DatePipe
  ) { }

  ngOnInit() {

    this.user = JSON.parse(localStorage.getItem('user'));
    this.evento = JSON.parse(localStorage.getItem('detalle-evento'));
    this.estados = JSON.parse(localStorage.getItem('estados'));
    this.roles = JSON.parse(localStorage.getItem('roles'));
    this.tipos = JSON.parse(localStorage.getItem('tipos'));
    this.tipo = this.evento.Tipo;
    this.nombre = this.evento.Nombre;
    this.detalle = this.evento.Detalle;
    this.fechaInicio = this.evento.FechaInicio;
    this.fechaFin = this.evento.FechaFin;
    this.encargado = this.evento.Encargado;
    this.cupos = this.evento.Cupos;

    let data = {
      evento: JSON.parse(localStorage.getItem('detalle-evento')).id,
    };

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('http://localhost:3000/users/staff', data, { headers })
      .map(res => res.json())
      .subscribe(data => {

        this.staff = data.staff;
        localStorage.setItem('staff' ,JSON.stringify(data.staff));
        this.coordis = data.coordis;
        localStorage.setItem('coordis' ,JSON.stringify(data.coordis));
        this.directores = data.directores;
        localStorage.setItem('directores' ,JSON.stringify(data.directores));
        this.guias = data.guias;

        for (let i = 0; i < this.guias.length; i++) {
          var date = this.guias[i].FechaNacimiento.slice(0,10);
          var dateArray = date.split("-");
          var rightNow = new Date();
          var res = rightNow.toISOString().slice(0,10).split("-");
          var edad =  parseInt(res[0]) - dateArray[0] -1;
          
          if ((parseInt(res[1]) > dateArray[1]) || (parseInt(res[1]) == dateArray[1] && parseInt(res[2]) >= dateArray[2])) {
            edad++;
          }
    
          this.guias[i].Edad = edad;
        }

        localStorage.setItem('guias' ,JSON.stringify(data.guias));

      }, err => {
        console.log('Error al pedir los coordis: ', err);
        return false;
      });

  }

  marcarDisponibilidad(i,tipo) {
    let id_Evento = this.evento.id;
    let id_Estado = tipo;

    let data = {
      id_Evento: id_Evento,
      id_Guia: this.user.id,
      id_Estado: id_Estado
    };

    this.evento.Estado = id_Estado;
    localStorage.setItem('dellate-evento', JSON.stringify(this.evento));

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('http://localhost:3000/users/marcar-disponibilidad', data, { headers })
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
        } else {
          this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
        }
    });
  }

  // Asignar Encargado
  asignarEncargado(i){
    this.encargado = this.baquianos_coordis[i].id;
    this.nombreEncargado = this.baquianos_coordis[i].Nombre+' '+this.baquianos_coordis[i].Apellido;
    this.mostrar_lista = false;
  }

  getBaquianosyCoordis(){

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
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

        this.baquianos_coordis = data.guias;

        //localStorage.setItem('guias', JSON.stringify(data.guias));
      }, err => {
        console.log('Error al pedir los guias: ', err);
        return false;
      });

    this.mostrar_lista = true;
  }

  actualizarEvento() {

    // // Valida que no se haya dejado ninguna casilla vacia
    if (this.faltaAlgunaCasilla()) {
      this.flashMessage.show('Por favor, llene todas las casillas.', { cssClass: 'custom-danger', timeout: 5000 });
      return false;
    }

    // Convertimos el string de la cantidad a un entero
    const cupos = Number(this.cupos);

    const data = {
      id: this.evento.id,
      Cupos: cupos,
      Detalle: this.detalle,
      Encargado: this.encargado,
      FechaFin: this.fechaFin,
      FechaInicio: this.fechaInicio,
      Nombre: this.nombre,
      Tipo: this.tipo
    }

    let headers = new Headers();

    // Settear los encabezados para la petición al API
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    // Hacer la petición, se retorna una promesa
    this.http.post('http://localhost:3000/users/actualizar-evento', data, { headers })
      .map(res => res.json())
      .subscribe(response => {
        if (response.success) {
          this.evento.Cupos = this.cupos;
          this.evento.Detalle = this.detalle;
          this.evento.Encargado = this.encargado;
          this.evento.FechaFin = this.fechaFin;
          this.evento.FechaInicio = this.fechaInicio;
          this.evento.Nombre = this.nombre;
          this.evento.Tipo = this.tipo;
          localStorage.setItem('detalle-evento', JSON.stringify(this.evento));
          this.flashMessage.show(response.msg, { cssClass: 'custom-success', timeout: 3000 });
        } else {
          this.flashMessage.show(response.msg, { cssClass: 'custom-danger', timeout: 3000 });
        }
        location.reload();
      });   

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

  botonRegresar() {
    this.router.navigate(['lista-eventos']);
  }

  asignarCoordis() {
    this.router.navigate(['asignar-coordis']);
  }

  asignarDirectores() {
    this.router.navigate(['asignar-directores']);
  }

  asignarStaff() {
    this.router.navigate(['asignar-staff']);
  }

}
