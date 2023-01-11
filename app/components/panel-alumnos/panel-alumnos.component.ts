import { Component, OnInit } from '@angular/core';
import { AlumnoService } from 'src/app/services/alumno.service';

@Component({
  selector: 'app-panel-alumnos',
  templateUrl: './panel-alumnos.component.html',
  styleUrls: ['./panel-alumnos.component.css']
})
export class PanelAlumnosComponent implements OnInit {

  alumnos: any = [];
  busquedaAlumnos: any[] = [];
  tablaAlumnos: any = [];
  paginacion: any[] = [];
  paginaActual: number = 0;
  ultimaPagina: number = 0;
  buscarAlumno: string = "";

  constructor(private alumnoService: AlumnoService) {}

  ngOnInit(): void {
    this.obtenerAlumnos();
  }

  async obtenerAlumnos() {
    let response: any = await this.alumnoService.getAll({}, true);
    this.alumnos = response.rows;
    this.busquedaAlumnos = this.alumnos;
    this.ultimaPagina = Math.ceil(this.alumnos.length / 10);
    this.paginacion = Array(this.ultimaPagina);
    this.cambiarPagina(this.paginaActual);
  }

  cambiarPagina(pagina: number) {
    this.tablaAlumnos = this.busquedaAlumnos.slice(pagina * 10, (pagina + 1) * 10);
    this.paginaActual = pagina;
  }

  buscarAlumnos() {
    this.busquedaAlumnos = this.alumnos.filter(
      (alumno: any) => {
        return alumno.nombreCompleto.toUpperCase().includes(this.buscarAlumno.toUpperCase())
          || alumno.usuario.toUpperCase().includes(this.buscarAlumno.toUpperCase())
      }
    );
    this.ultimaPagina = Math.ceil(this.busquedaAlumnos.length / 10);
    this.paginacion = Array(this.ultimaPagina);
    this.cambiarPagina(0);
  }

  deleteUser(alumnoId: any){
    this.alumnoService.deleteUser(alumnoId);
    for(let i = 0; i < this.tablaAlumnos.length; i++) {
      if(this.tablaAlumnos[i].id === alumnoId) {
        this.tablaAlumnos[i].borrado = 1;
      }
    }
  }

  activateUser(alumnoId: any){
    this.alumnoService.activateUser(alumnoId);
    for(let i = 0; i < this.tablaAlumnos.length; i++) {
      if(this.tablaAlumnos[i].id === alumnoId) {
        this.tablaAlumnos[i].borrado = 0;
      }
    }
  }

}
