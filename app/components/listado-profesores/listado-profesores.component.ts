import { Component, Input, OnInit } from '@angular/core';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listado-profesores',
  templateUrl: './listado-profesores.component.html',
  styleUrls: ['./listado-profesores.component.css']
})
export class ListadoProfesoresComponent implements OnInit {

  @Input() profesores: any[] = [];

  token: string | null = null;
  rolId: string | null = null;
  email: string | null = null;

  constructor(
    private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    this.getLocalStorage();
  }

  getLocalStorage(): void {
    let localStorage = this.localStorageService.getData();
    if (localStorage.token) {
      this.token = localStorage.token;
      this.rolId = localStorage.rolId;
      this.email = localStorage.email;
    }
  }

  getUserImage(profesor: any): string {
    return profesor?.imagen ? `${environment.API_URL}/images/avatars/${profesor.imagen}` : 'https://eu.ui-avatars.com/api/?name='+profesor?.nombreCompleto+'&size=250' ;
  }

}
