import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { ApiRespuesta, Registro } from '../models/registro';

@Injectable({
  providedIn: 'root',
})
export class RegistroApiService {
  private baseUrl = environment.apiBaseUrl;
  
  private NUBE_KEY = 'utp_registros_nube';
  private LOCALES_KEY = 'utp_registros_locales';

  constructor(private http: HttpClient) {}

  private crearHeaders() {
    const token = localStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      })
    };
  }

  private obtenerLocales(): Registro[] {
    const data = localStorage.getItem(this.LOCALES_KEY);
    return data ? JSON.parse(data) : [];
  }

  private guardarLocales(locales: Registro[]) {
    localStorage.setItem(this.LOCALES_KEY, JSON.stringify(locales));
  }

  private obtenerCacheNube(): Registro[] {
    const data = localStorage.getItem(this.NUBE_KEY);
    return data ? JSON.parse(data) : [];
  }

  private guardarCacheNube(nube: Registro[]) {
    localStorage.setItem(this.NUBE_KEY, JSON.stringify(nube));
  }

  guardarRegistro(registro: Registro): Observable<ApiRespuesta> {
    const registroConFecha = {
      ...registro,
      fecha: registro.fecha || new Date().toISOString()
    };

    return this.http.post<ApiRespuesta>(`${this.baseUrl}/registros`, registroConFecha).pipe(
      tap((resp) => {
        if (resp && resp.ok && resp.data) {
          const cacheNube = this.obtenerCacheNube();
          // Evitar duplicados por id
          const index = cacheNube.findIndex(r => r.id === resp.data?.id);
          if (index > -1) {
            cacheNube[index] = resp.data;
          } else {
            cacheNube.unshift(resp.data);
          }
          this.guardarCacheNube(cacheNube);
        }
      }),
      catchError((error) => {
        console.warn('Error al guardar en nube, almacenando localmente de forma temporal...', error);
        const locales = this.obtenerLocales();
        locales.unshift(registroConFecha);
        this.guardarLocales(locales);
        
        return of({
          ok: true,
          mensaje: 'Guardado localmente. Se sincronizará en la nube más tarde.',
          data: registroConFecha
        } as ApiRespuesta);
      })
    );
  }

  listarRegistros(): Observable<Registro[]> {
    return this.http.get<Registro[]>(`${this.baseUrl}/registros`).pipe(
      map((nubeRegistros) => {
        const registros = Array.isArray(nubeRegistros) ? nubeRegistros : [];
        this.guardarCacheNube(registros);
        
        const locales = this.obtenerLocales();
        return [...locales, ...registros];
      }),
      catchError((error) => {
        console.warn('Fallo de red al listar registros, sirviendo desde el almacenamiento local...', error);
        const locales = this.obtenerLocales();
        const cacheNube = this.obtenerCacheNube();
        return of([...locales, ...cacheNube]);
      })
    );
  }
}
