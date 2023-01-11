import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-crear-cuenta',
  templateUrl: './crear-cuenta.component.html',
  styleUrls: ['./crear-cuenta.component.css']
})
export class CrearCuentaComponent implements OnInit {

  opcion_alumno_profe:string;
  constructor(
  ) {
    this.opcion_alumno_profe='¿Eres profesor o alumno?';
    
  }

  ngOnInit(): void {
  }
  //Esta funcion comprueba si el usuario a registrar es un alumno o un profesor
  opcion_profesor():boolean {
    return this.opcion_alumno_profe=="Profesor";
  }
  
}
