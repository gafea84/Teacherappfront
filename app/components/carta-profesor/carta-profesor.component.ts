import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PerfilAlumnosService } from 'src/app/services/perfil-alumnos.service';
import { environment } from 'src/environments/environment';
import Swal from'sweetalert2';

@Component({
  selector: 'app-carta-profesor',
  templateUrl: './carta-profesor.component.html',
  styleUrls: ['./carta-profesor.component.css']
})
export class CartaProfesorComponent implements OnInit {

  userForm_opinion:FormGroup;
  @Input() Profesor!:any;
  imagen:string="";
  aceptado:boolean=false;
  comentar:string="Enviar datos";

  constructor(
    private llamadasalumnos:PerfilAlumnosService
  ) {
    this.userForm_opinion=new FormGroup({
      comentario:new FormControl('this.Profesor.comentario',[Validators.required]),
      puntuacion:new FormControl('this.Profesor.puntuacion',[Validators.required]),
    });
  }

  ngOnInit(): void {
    this.userForm_opinion.setValue({comentario:this.Profesor.comentario,puntuacion:this.Profesor.puntuacion});
    this.imagen=this.url_imagen(this.Profesor.imagen);
    if (this.Profesor.estado==0){
      this.userForm_opinion.get('comentario')?.disable();
      this.userForm_opinion.get('puntuacion')?.disable();
      this.comentar="No has sido aceptado";
    }
  }
  //Esta funcion obtiene la url de la imagen de un usuario
  url_imagen(id_imagen:string):string{
    if(id_imagen==null){
      return "./assets/images/blanco.png";
    }
    return environment.API_URL+"/images/avatars/"+id_imagen;
  }
  //Esta funcion registra la opinion de un usuario
  async getDataForm():Promise<void>{
    let datos2=Object.assign(this.userForm_opinion.value,{id:this.Profesor.id});
    await this.llamadasalumnos.opinar(datos2,localStorage.getItem('token'))
    .then((response: any)=>{
      Swal.fire('Correcto', 'Opinion enviada', 'success');
    })
    .catch((err: any)=>{
      this.llamadasalumnos.gestion_de_errores_opiniones(err);
    })
  }
  //Esta funcion comprueba si la opinion y puntuacion de un usuario es valida
  opinion_valida():void{
    let comentario=this.userForm_opinion.get('comentario')?.value;
    let puntuacion=this.userForm_opinion.get('puntuacion')?.value;
    let comentario_vacio:boolean=(comentario==null) || (comentario==undefined) || (comentario=="");
    let puntuacion_vacia:boolean= (puntuacion==null) || (puntuacion==undefined);
    if(comentario_vacio==true && puntuacion_vacia==true){
      this.aceptado=false;
    }
    else if(comentario_vacio==true && (puntuacion<0 || puntuacion >10 || Number.isInteger(puntuacion)==false)){
      this.aceptado=false;
    }
    else if(comentario_vacio==false && puntuacion_vacia==true){
      this.aceptado=true;
    }
    else if(puntuacion<0 || puntuacion >10 || Number.isInteger(puntuacion)==false){
      this.aceptado=false;
    }
    else{
      this.aceptado=true;
    }
  }
  
}
