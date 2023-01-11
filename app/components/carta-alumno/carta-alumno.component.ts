import { Component, Input, OnInit } from '@angular/core';
import { PerfilProfesService } from 'src/app/services/perfil-profes.service';
import { environment } from 'src/environments/environment';
import Swal from'sweetalert2';

@Component({
  selector: 'app-carta-alumno',
  templateUrl: './carta-alumno.component.html',
  styleUrls: ['./carta-alumno.component.css']
})
export class CartaAlumnoComponent implements OnInit {

  aceptado:boolean;
  @Input() Alumno!:any;
  imagen:string="";

  constructor(
    private llamadasprofesor:PerfilProfesService
  ) {
    this.aceptado=true;
  }

  ngOnInit(): void {
    if(this.Alumno.estado==0){
      this.aceptado=false;
    }
    this.imagen=this.url_imagen(this.Alumno.imagen);
  }
  //Esta funcion permite que un profesor acepte a un alumno
  async aceptar_alumno():Promise<void>{
    await this.llamadasprofesor.aceptar_alumnos(this.Alumno.id,localStorage.getItem('token'))
    .then((response:any)=>{
      Swal.fire('Correcto', 'Has aceptado a este alumno', 'success');
      window.location.reload();
    })
    .catch((err:any)=>{
      this.llamadasprofesor.gestion_de_errores_aceptar_alumno(err);
    });
  }
  //Esta funcion obtiene la url de la imagen de un usuario
  url_imagen(id_imagen:string):string{
    if(id_imagen==null){
      return "./assets/images/blanco.png";
    }
    return environment.API_URL+"/images/avatars/"+id_imagen;
  }
  
}
