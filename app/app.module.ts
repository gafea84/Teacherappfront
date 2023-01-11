import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AgmCoreModule } from '@agm/core';
// Componentes
import { AppComponent } from './app.component';
import { CabeceraComponent } from './components/cabecera/cabecera.component';
import { BuscadorComponent } from './components/buscador/buscador.component';
import { IniciarSesionComponent } from './components/iniciar-sesion/iniciar-sesion.component';
import { CrearCuentaComponent } from './components/crear-cuenta/crear-cuenta.component';
import { ListadoProfesoresComponent } from './components/listado-profesores/listado-profesores.component';
import { MapaProfesoresComponent } from './components/mapa-profesores/mapa-profesores.component';
import { PanelComponent } from './components/panel/panel.component';
import { PanelProfesoresComponent } from './components/panel-profesores/panel-profesores.component';
import { CrearAlumnoComponent } from './components/crear-alumno/crear-alumno.component';
import { CrearProfesorComponent } from './components/crear-profesor/crear-profesor.component';
import { BarraProfesorComponent } from './components/barra-profesor/barra-profesor.component';
import { ProfesorAlumnosComponent } from './components/profesor-alumnos/profesor-alumnos.component';
import { ProfesorPerfilComponent } from './components/profesor-perfil/profesor-perfil.component';
import { CartaAlumnoComponent } from './components/carta-alumno/carta-alumno.component';
import { AlumnoPerfilComponent } from './components/alumno-perfil/alumno-perfil.component';
import { AlumnoOpinarComponent } from './components/alumno-opinar/alumno-opinar.component';
import { BarraAlumnoComponent } from './components/barra-alumno/barra-alumno.component';
import { CartaProfesorComponent } from './components/carta-profesor/carta-profesor.component';
import { PanelAlumnosComponent } from './components/panel-alumnos/panel-alumnos.component';
import { InfoProfesorComponent } from './components/info-profesor/info-profesor.component';
import { AdminPerfilComponent } from './components/admin-perfil/admin-perfil.component';
import { ChatComponent } from './components/chat/chat.component';
// Pipes
import { FormatoMedidasPipe } from './pipes/formato-medidas.pipe';
// Entorno
import { environment } from 'src/environments/environment';
import { RecuperarComponent } from './components/recuperar/recuperar.component';


@NgModule({
  declarations: [
    AppComponent,
    CabeceraComponent,
    BuscadorComponent,
    IniciarSesionComponent,
    CrearCuentaComponent,
    ListadoProfesoresComponent,
    MapaProfesoresComponent,
    FormatoMedidasPipe,
    CrearAlumnoComponent,
    CrearProfesorComponent,
    BarraProfesorComponent,
    ProfesorAlumnosComponent,
    ProfesorPerfilComponent,
    CartaAlumnoComponent,
    AlumnoPerfilComponent,
    AlumnoOpinarComponent,
    BarraAlumnoComponent,
    CartaProfesorComponent,
    PanelComponent,
    PanelProfesoresComponent,
    PanelAlumnosComponent,
    InfoProfesorComponent,
    AdminPerfilComponent,
    RecuperarComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    AgmCoreModule.forRoot({
      apiKey: environment.GOOGLE_API_KEY,
      libraries: ['places']
    }),
    ReactiveFormsModule, //Formularios
    FormsModule //NgModul
  ],
  providers: [
    FormatoMedidasPipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
