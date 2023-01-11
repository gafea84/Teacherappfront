import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InscripcionesService } from 'src/app/services/inscripciones.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OpinionesService } from 'src/app/services/opiniones.service';
import { ProfesorService } from 'src/app/services/profesor.service';
import { environment } from 'src/environments/environment';

import Swal from'sweetalert2';

@Component({
  selector: 'app-info-profesor',
  templateUrl: './info-profesor.component.html',
  styleUrls: ['./info-profesor.component.css']
})
export class InfoProfesorComponent implements OnInit {

  token: string | null = null;
  rolId: string | null = null;
  email: string | null = null;

  profesor: any;
  opiniones: any[] = [];

  btnInscribirseTxt: string = 'Inscribirse';
  btnInscribirseEnable: boolean = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private localStorageService: LocalStorageService,
    private profesorService: ProfesorService,
    private opinionesService: OpinionesService,
    private router: Router,
    private inscripcionesService: InscripcionesService
  ) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params: any) => this.getInfoProfesor(params.profesorId))
  }

  async getInfoProfesor(profesorId: number): Promise<any> {
    let body = {
      searchConditions: [
        {
          "column": "id",
          "operator": "=",
          "value": String(profesorId)
        }
      ],
      latitud: 51.0754321,
      longitud: 12.4878015,
      maximaDistancia: 100000000000
    }
    let response: any = await this.profesorService.getAll(body, true);
    this.profesor = response.rows[0];
    if(this.profesor === undefined) {
      this.router.navigate(['TeacherApp/buscador']);
      return;
    }
    this.getInscripcion(profesorId);
    this.getOpiniones(profesorId);
  }

  async getInscripcion(profesorId: number) {
    let body: any = {
      "searchConditions": [
        {
          "column": "profesoresId",
          "operator": "=",
          "value": profesorId
        }
      ]
    };
    let response = await this.inscripcionesService.getInscripcionesAlumno(body);
    if (response.rows.length > 0) {
      this.btnInscribirseTxt = 'Ya estás suscrito';
      this.btnInscribirseEnable = true;
    }
  }

  getLocalStorage(): void {
    let localStorage = this.localStorageService.getData();
    if (localStorage.token) {
      this.token = localStorage.token;
      this.rolId = localStorage.rolId;
      this.email = localStorage.email;
    }
  }

  async getOpiniones(profesorId: number) {
    let body = {
      id: profesorId
    }
    let response: any = await this.opinionesService.getAll(body);
    this.opiniones = response.rows;
  }

  getStars(puntuacion: number, type: string): Array<number> {
    let complete = Math.trunc(puntuacion / 2);
    let half = puntuacion % 2;
    let empty = 5 - (complete + half);
    let out = [];
    switch (type) {
      case 'complete':
        out = new Array(complete).fill(1);
        break;
      case 'half':
        out = new Array(half).fill(1);
        break;
      case 'empty':
        out = new Array(empty).fill(1);
        break;
    }
    return out;
  }

  async inscribirse() {
    await this.inscripcionesService.inscribirAlumno(this.profesor.id)
      .then( response => {
        this.getInscripcion(this.profesor.id);
        Swal.fire(
          'Inscripción realizada correctamente',
          'Ya eres alumno de '+this.profesor.nombreCompleto,
          'success'
        );
      })
      .catch((err) => {
        Swal.fire(
          'Error',
          err.error.messageError,
          'error'
        );
      });
  }

  getUserImage(profesor: any): string {
    return profesor?.imagen ? `${environment.API_URL}/images/avatars/${profesor.imagen}` : 'https://eu.ui-avatars.com/api/?name='+profesor?.nombreCompleto+'&size=250' ;
  }

}
