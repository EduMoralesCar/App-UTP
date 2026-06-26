import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiRespuesta, Registro } from '../models/registro';

@Injectable({
  providedIn: 'root',
})
export class RegistroApiService {
  private baseUrl = environment.apiBaseUrl;
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

  guardarRegistro(registro: Registro): Observable<ApiRespuesta> {
    return this.http.post<ApiRespuesta>(`${this.baseUrl}/registros`, registro);
  }
  listarRegistros(): Observable<Registro[]> {
    return this.http.get<Registro[]>(`${this.baseUrl}/registros`);
  }
}
