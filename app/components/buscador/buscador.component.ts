import { Component, ElementRef, NgZone, OnInit, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Rama } from 'src/app/interfaces/rama.interface';
import { LocalizacionService } from 'src/app/services/localizacion.service';
import { ProfesorService } from 'src/app/services/profesor.service';
import { RamaService } from 'src/app/services/rama.service';

import Swal from'sweetalert2';

@Component({
  selector: 'app-buscador',
  templateUrl: './buscador.component.html',
  styleUrls: ['./buscador.component.css']
})
export class BuscadorComponent implements OnInit {

  @ViewChild('search') public searchElementRef!: ElementRef;
  @ViewChild('searchButton') searchButton!: ElementRef;

  
  private geoCoder: any;
  ramas: Rama[] = [];
  ramaSeleccionada: number = 0;
  latitude!: number;
  longitude!: number;
  distanciaSeleccionada: number = 100;
  limiteDistancia: boolean = false;
  profesores: any[] = [];
  mostrarResultados: boolean = false;
  mostrarMapa: boolean = false;

  constructor(
    private ramaService: RamaService,
    private profesorService: ProfesorService,
    private localizacionService: LocalizacionService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) { }

  async ngOnInit() {
    this.obtenerRamas();
    this.mapsAPILoader.load().then(() => {
      this.geoCoder = new google.maps.Geocoder;
      let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.obtenerDireccion(this.latitude, this.longitude);
        });
      });
    });
  }

  async obtenerRamas() {
    let data = await this.ramaService.getAll();
    this.ramas = data.rows;
  }

  async obtenerUbicacion() {
    this.localizacionService.getPosition()
      .then((posicion) => {
        this.latitude = posicion.lat;
        this.longitude = posicion.lng;
        this.obtenerDireccion(this.latitude, this.longitude);
      })
      .catch((err) => {
        Swal.fire('No te localizamos', 'Comprueba los permisos de acceso a ubicación o utiliza el buscador', 'error');
      });
  }

  obtenerDireccion(latitude: number, longitude: number) {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results: any, status: any) => {
      if (status === 'OK') {
        let direccion = results.find((ele: any) => ele.types.includes('postal_code'))
        this.searchElementRef.nativeElement.value = direccion.formatted_address;
      } else {
        this.searchElementRef.nativeElement.value = 'ERROR';
      }
    });
  }

  async buscarProfesores() {
    if (this.latitude === undefined || this.longitude === undefined) {
      Swal.fire('Introduce una localización', 'Utiliza la función "Usar mi ubicación" o el buscador', 'error');
      return;
    }
    let body: any = {}
    if (Number(this.ramaSeleccionada) !== 0) {
      body.searchConditions = [{
        column: "ramaId",
        operator: "=",
        value: this.ramaSeleccionada
      }];
    }
    body.latitud = this.latitude;
    body.longitud = this.longitude;
    body.maximaDistancia = this.limiteDistancia ? 1000000000 : this.distanciaSeleccionada;
    let response: any = await this.profesorService.getAll(body);
    this.searchButton.nativeElement.click();
    this.profesores = response.rows;
    this.mostrarResultados = true;
  }
  
}
