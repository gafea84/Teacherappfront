import { Component, OnInit } from '@angular/core';
import { FormatoMedidasPipe } from 'src/app/pipes/formato-medidas.pipe';
import { ProfesorService } from 'src/app/services/profesor.service';

import Swal from'sweetalert2';

@Component({
  selector: 'app-panel-profesores',
  templateUrl: './panel-profesores.component.html',
  styleUrls: ['./panel-profesores.component.css']
})
export class PanelProfesoresComponent implements OnInit {

  profesores: any[] = [];
  busquedaProfesores: any[] = [];
  tablaProfesores: any = [];
  paginacion: any[] = [];
  paginaActual: number = 0;
  ultimaPagina: number = 0;
  buscarProfesor: string = "";

  constructor(
    private profesorService: ProfesorService,
    private pipeMedidas: FormatoMedidasPipe
  ) { }

  ngOnInit(): void {
    this.obtenerProfesores();
  }

  async obtenerProfesores() {
    let response: any = await this.profesorService.getAllPrivate({});
    this.profesores = response.rows;
    this.busquedaProfesores = this.profesores;
    this.ultimaPagina = Math.ceil(this.profesores.length / 10);
    this.paginacion = Array(this.ultimaPagina);
    this.cambiarPagina(this.paginaActual);
  }

  cambiarPagina(pagina: number) {
    this.tablaProfesores = this.busquedaProfesores.slice(pagina * 10, (pagina + 1) * 10);
    this.paginaActual = pagina;
  }

  buscarProfesores() {
    this.busquedaProfesores = this.profesores.filter(
      (profesor: any) => {
        return profesor.nombreCompleto.toUpperCase().includes(this.buscarProfesor.toUpperCase())
          || profesor.nombreRama.toUpperCase().includes(this.buscarProfesor.toUpperCase())
      }
    );
    this.ultimaPagina = Math.ceil(this.busquedaProfesores.length / 10);
    this.paginacion = Array(this.ultimaPagina);
    this.cambiarPagina(0);
  }

  activarProfesor(profesorId: number) {
    let profesor = this.profesores.find((profesor: any) => profesor.id === profesorId);
    let alertData = {
      title: 'Validación de profesor',
      html: "¿Quieres validar al profesor <b>"+profesor.nombreCompleto+"</b>? <table class='table align-middle table-bordered mt-3'> <tr><th>Rama</th><td>"+profesor.nombreRama+"</td></tr><tr> <th>Descripción</th><td>"+profesor.descripcion+"</td></tr> <tr><th>Precio/Hora</th><td>"+this.pipeMedidas.transform(Number(profesor.precioHora), '€')+"</td></tr> <tr><th>Experiencia</th><td>"+profesor.experiencia+"</td></tr></table>",
      confirmButtonText: 'Si, validar',
      success: {
        title: 'Validado correctamente',
        html: 'El profesor <b>'+profesor.nombreCompleto+'</b> ya está disponible en el buscador de profesores.'
      }
    }
    this.showAlert(profesor, alertData, () => { 
      profesor.validado = 1; 
      this.profesorService.validate(profesor.id);
    });
  }

  bloquearProfesor(profesorId: number) {
    let profesor = this.profesores.find((profesor: any) => profesor.id === profesorId);
    let alertData = {
      title: 'Bloqueo de profesor',
      html: "¿Quieres bloquear al profesor <b>"+profesor.nombreCompleto+"</b>? <table class='table align-middle table-bordered mt-3'> <tr><th>Rama</th><td>"+profesor.nombreRama+"</td></tr><tr> <th>Descripción</th><td>"+profesor.descripcion+"</td></tr> <tr><th>Precio/Hora</th><td>"+this.pipeMedidas.transform(profesor.precioHora, '€')+"</td></tr> <tr><th>Experiencia</th><td>"+profesor.experiencia+"</td></tr></table>",
      confirmButtonText: 'Si, bloquear',
      success: {
        title: 'Bloqueado correctamente',
        html: 'El profesor <b>'+profesor.nombreCompleto+'</b> ha sido bloqueado.'
      }
    }
    this.showAlert(profesor, alertData, () => { 
      profesor.validado = 0; 
      this.profesorService.lock(profesor.id);
    });
  }

  showAlert (profesor: any, alertData: any, callback: Function) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success ms-2',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });
    swalWithBootstrapButtons.fire({
      title: alertData.title,
      html: alertData.html,
      showCancelButton: true,
      confirmButtonText: alertData.confirmButtonText,
      cancelButtonText: 'No, cancelar',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
        swalWithBootstrapButtons.fire(
          alertData.success.title,
          alertData.success.html,
          'success'
        )
      }
    });
  }

}
