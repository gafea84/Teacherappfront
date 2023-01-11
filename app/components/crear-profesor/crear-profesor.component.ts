import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PerfilProfesService } from 'src/app/services/perfil-profes.service';
import { RamaService } from 'src/app/services/rama.service';
import { Rama } from 'src/app/interfaces/rama.interface';
import { LocalizacionService } from 'src/app/services/localizacion.service';
import Swal from'sweetalert2';
import { LoginService } from 'src/app/services/login.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-crear-profesor',
  templateUrl: './crear-profesor.component.html',
  styleUrls: ['./crear-profesor.component.css']
})
export class CrearProfesorComponent implements OnInit {

  userForm_profesor:FormGroup;
  crear_modificar:string;
  es_modificar:boolean;
  ramas: Rama[] = [];
  latitud:number=40.34;
  longitud:number=-3.38;
  image: any;
  contra: string="";
  imagen:string="";

  constructor(
    private router:Router,
    private llamadasprofesor:PerfilProfesService,
    private ramaService:RamaService,
    private localizacionService: LocalizacionService,
    private loginService:LoginService,
    private usuarioService:UsuarioService
  ) {
    this.crear_modificar='Crear cuenta';
    this.es_modificar=false;
    this.userForm_profesor=new FormGroup({
      userName:new FormControl('',[Validators.required]),
      nombreCompleto:new FormControl('',[Validators.required]),
      telefono:new FormControl('',[Validators.required]),
      descripcion:new FormControl('',[Validators.required]),
      precioHora:new FormControl('',[Validators.required,Validators.min(0)]),
      experiencia:new FormControl('',[Validators.required,Validators.min(0)]),
      imagen:new FormControl('',[Validators.required]),
      ramaId:new FormControl('',[Validators.required]),
      email:new FormControl('',[Validators.required,Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,20}$/)]),
      password:new FormControl('',[Validators.required,Validators.minLength(6)]),
    });
    
  }

  ngOnInit(): void {
    if(this.router.url=='/TeacherApp/crear_cuenta'){
      this.obtenerUbicacion();
      this.crear_modificar='Crear cuenta';
      this.obtenerRamas();
    }
    else{
      this.crear_modificar='Modificar datos';
      this.obtenerRamas();
      this.es_modificar=true;
      this.datos();
    }
  }
  //Funcion para crear un profesor o modificar sus datos
  async getDataForm():Promise<void>{
    if(this.router.url=='/TeacherApp/crear_cuenta'){
      this.crear_profesor(this.userForm_profesor.value);
    }
    else{
      this.modificar_profesor(this.userForm_profesor.value);
    }
    
  }
  //Funcion auxiliar para crear un profesor
  async crear_profesor(datos:any){
    let datos2=Object.assign(datos,{longitud:this.longitud,latitud:this.latitud});
    await this.llamadasprofesor.crear_profe(datos2)
    .then((response: any)=>{
      this.logearse({email:datos2.email,password:datos2.password});
    })
    .catch((err: any)=>{
      this.loginService.gestion_de_errores_crear_modificar(err);
    });
  }
  //Funcion auxiliar para modificar datos
  async modificar_profesor(datos:any){
    let email=this.userForm_profesor.get('email')?.value;
    let userName=this.userForm_profesor.get('userName')?.value;
    let datos2=Object.assign(datos,{email:email,userName:userName,longitud:this.longitud,latitud:this.latitud});
    await this.llamadasprofesor.mod_datos(datos2,localStorage.getItem('token'))
      .then((response: any)=>{
        this.guardaImagen();
        Swal.fire('Correcto', 'Usuario modificado', 'success');
        window.location.reload();
      })
      .catch((err: any)=>{
        this.loginService.gestion_de_errores_crear_modificar(err);
      });
  }
  //Funcion para dibujar los datos de un usuario al acceder a su perfil
  async datos():Promise<void> {
    await this.llamadasprofesor.datos(localStorage.getItem('token'))
    .then((response: any)=>{
      this.userForm_profesor=new FormGroup({
        userName:new FormControl(response.profesor.userName,[Validators.required]),
        nombreCompleto:new FormControl(response.profesor.nombreCompleto,[Validators.required]),
        telefono:new FormControl(response.profesor.telefono,[Validators.required]),
        descripcion:new FormControl(response.profesor.descripcion,[Validators.required]),
        precioHora:new FormControl(response.profesor.precioHora,[Validators.required]),
        experiencia:new FormControl(response.profesor.experiencia,[Validators.required]),
        imagen:new FormControl('',[]),
        ramaId:new FormControl(response.profesor.ramaId,[Validators.required]),
        email:new FormControl(response.profesor.email,[Validators.required,Validators.pattern(/^[\w-.]+@([\w-]+\.)+[\w-]{2,20}$/)]),
        password:new FormControl('',[Validators.required]),
      });
      this.latitud = response.profesor.latitud;
      this.longitud = response.profesor.longitud;
      this.userForm_profesor.get('userName')?.disable();
      this.userForm_profesor.get('email')?.disable();
      this.userForm_profesor.get('password')?.disable();
      this.imagen=this.url_imagen(response.profesor.imagen);
    })
    .catch((err: any)=>{
      this.llamadasprofesor.gestion_de_errores_datos_profesor(err);
    });
  }
  //Funcion para obtener las ramas que existen
  async obtenerRamas() {
    let data = await this.ramaService.getAll();
    this.ramas = data.rows;
  }
  //Funcion para dibujar en el mapa una ubicacion
  placeMarker($event:any){
    this.latitud = $event.coords.lat;
    this.longitud = $event.coords.lng;
  }
  //Funcion para obtener la ubicacion actual del usuario
  async obtenerUbicacion() {
    this.localizacionService.getPosition()
    .then((posicion) => {
      this.latitud = posicion.lat;
      this.longitud = posicion.lng;
    })
    .catch((err) => {
      Swal.fire('No te localizamos', 'Comprueba los permisos de acceso a ubicación o utiliza el buscador', 'error');
    });
  }
  //Funcion para logearse al crear la cuenta
  async logearse(inicio:any):Promise<void>{
    await this.loginService.login_user(inicio)
      .then(response => {
        localStorage.setItem('token', response.token);
        this.guardaImagen();
        this.loginService.gestion_de_login(response);
      })
      .catch(err=>{
        this.loginService.gestion_de_errores_login(err);
      });
  }
  //Funcion auxiliar para guardar la imagen de un usuario
  fileChoosen(event: any) {
    if(event.target.value) {
      this.image = <File>event.target.files[0];
    }
  }
  //Funcion para guardar la imagen de un usuario
  async guardaImagen() {
    if(this.image) {
      try {
        let fd = new FormData();
        if(this.image) {
          fd.append('imagen', this.image, this.image.name);
          await this.usuarioService.changeImageUser(fd);
        }
      } catch(err) {
        this.usuarioService.gestion_de_errores_cambiar_imagen(err);
      };
    }
  }
  //Esta funcion obtiene la url de la imagen de un usuario
  url_imagen(id_imagen:string):string{
    if(id_imagen==null){
      return "./assets/images/blanco.png";
    }
    return environment.API_URL+"/images/avatars/"+id_imagen;
  }
  //Esta funcion permite modificar la contraseña de un usuario
  async modificar_contra():Promise<void>{
    if(this.contra.length<6){
      Swal.fire('No valido', 'La contraseña debe tener al menos 6 caracteres', 'error');
    }
    else{
      await this.usuarioService.changePasswordUser(this.contra)
      .then(reponse=>{
        Swal.fire('Correcto', 'Contraseña modificada', 'success');
        window.location.reload();
      })
      .catch(err=>{
        this.usuarioService.gestion_de_errores_cambiar_contra(err);
      });
    }
  }
  
}