import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

// HTTP Requests
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: object;

  constructor(
    private http: Http,
    private router: Router
  ) { }

  ngOnInit() {

    let headers = new Headers();

    // Fetches the token of the currently logged in user from localStorage
    
    headers.append('Authorization', localStorage.getItem('id_token'));
    headers.append('Content-Type', 'application/json');

    this.http.get('http://localhost:3000/users/profile', { headers })
      .map(res => res.json())
      .subscribe(profile => {
        this.user = profile.user;
      }, err => {
        console.log('Error while getting the profile in ProfileComponent: ', err);
        return false;
      });
  }

  // completoFormulario() {
  //   return this.fechaNacimiento && this.sexo;
  // }
}
