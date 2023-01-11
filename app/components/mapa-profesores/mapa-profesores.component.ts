import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-mapa-profesores',
  templateUrl: './mapa-profesores.component.html',
  styleUrls: ['./mapa-profesores.component.css']
})
export class MapaProfesoresComponent implements OnInit {

  @Input() profesores: any[] = [];
  @Input() lat!: number;
  @Input() lon!: number;
  
  zoom: number = 10;
  token: string | null = null;
  rolId: string | null = null;
  email: string | null = null;

  constructor(
    private localStorageService: LocalStorageService,
    private router: Router
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

}
