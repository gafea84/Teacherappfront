import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// Componentes
import { AlumnoOpinarComponent } from './components/alumno-opinar/alumno-opinar.component';
import { AlumnoPerfilComponent } from './components/alumno-perfil/alumno-perfil.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { CrearCuentaComponent } from './components/crear-cuenta/crear-cuenta.component';
import { InfoProfesorComponent } from './components/info-profesor/info-profesor.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { ProfesorAlumnosComponent } from './components/profesor-alumnos/profesor-alumnos.component';
import { ProfesorPerfilComponent } from './components/profesor-perfil/profesor-perfil.component';
import { PanelProfesoresComponent } from './components/panel-profesores/panel-profesores.component';
import { PanelAlumnosComponent } from './components/panel-alumnos/panel-alumnos.component';
import { AdminPerfilComponent } from './components/admin-perfil/admin-perfil.component';
// Guards
import { AlumnoGuard } from './guards/alumno.guard';
import { ProfesorGuard } from './guards/profesor.guard';
import { AdminGuard } from './guards/admin.guard';
import { RecuperarComponent } from './components/recuperar/recuperar.component';
import { ChatComponent } from './components/chat/chat.component';


const routes: Routes = [
  { path: "", pathMatch: "full", redirectTo: "TeacherApp/buscador" },
  {path:"home",component:BuscadorComponent},
  { path: "TeacherApp/buscador", component: BuscadorComponent },
  { path: "TeacherApp/iniciar_sesion", component: IniciarSesionComponent },
  { path: "TeacherApp/crear_cuenta", component: CrearCuentaComponent },
  { path: "TeacherApp/info-profesor/:profesorId", component: InfoProfesorComponent },
  { path: "TeacherApp/profesor/perfil", component: ProfesorPerfilComponent, canActivate: [ProfesorGuard] },
  { path: "TeacherApp/profesor/alumnos", component: ProfesorAlumnosComponent, canActivate: [ProfesorGuard] },
  { path: "TeacherApp/alumno/perfil", component: AlumnoPerfilComponent, canActivate: [AlumnoGuard] },
  { path: "TeacherApp/alumno/opinar", component: AlumnoOpinarComponent, canActivate: [AlumnoGuard] },
  { path: "TeacherApp/admin/perfil", component: AdminPerfilComponent, canActivate: [AdminGuard] },
  { path: "TeacherApp/admin/profesores", component: PanelProfesoresComponent, canActivate: [AdminGuard] },
  { path: "TeacherApp/admin/alumnos", component: PanelAlumnosComponent, canActivate: [AdminGuard] },
  { path: "TeacherApp/recuperar_password", component: RecuperarComponent },
  { path: "TeacherApp/chat", component: ChatComponent },
  { path: "**", redirectTo: "home" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
