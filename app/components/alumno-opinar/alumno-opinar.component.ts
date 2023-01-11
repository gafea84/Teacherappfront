import { Component, OnInit } from '@angular/core';
import { PerfilAlumnosService } from 'src/app/services/perfil-alumnos.service';

@Component({
  selector: 'app-alumno-opinar',
  templateUrl: './alumno-opinar.component.html',
  styleUrls: ['./alumno-opinar.component.css']
})
export class AlumnoOpinarComponent implements OnInit {

  arrprofes:any[]=[];

  constructor(
    private llamadas_alumnos:PerfilAlumnosService
  ) { }

  async ngOnInit(): Promise<void> {
    await this.llamadas_alumnos.profesores(localStorage.getItem('token'))
    .then((response:any)=>{
      this.arrprofes=response.rows;
    })
    .catch((err:any)=>{
      this.llamadas_alumnos.gestion_de_errores_profesores(err);
    });
  }
  
}
