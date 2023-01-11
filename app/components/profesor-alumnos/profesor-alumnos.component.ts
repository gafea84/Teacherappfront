import { Component, OnInit } from '@angular/core';
import { PerfilProfesService } from 'src/app/services/perfil-profes.service';

@Component({
  selector: 'app-profesor-alumnos',
  templateUrl: './profesor-alumnos.component.html',
  styleUrls: ['./profesor-alumnos.component.css']
})
export class ProfesorAlumnosComponent implements OnInit {

  arralumnos:any[]=[];

  constructor(
    private llamadas_profesores:PerfilProfesService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.llamadas_profesores.alumnos(localStorage.getItem('token'))
    .then(response=>{
      this.arralumnos=response.rows;
    })
    .catch(err=>{
      this.llamadas_profesores.gestion_de_errores_alumnos(err);
    });
  }

}
