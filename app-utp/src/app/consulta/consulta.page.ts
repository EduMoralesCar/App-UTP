import { Component, OnInit } from '@angular/core';
import { Registro } from '../models/registro';
import { RegistroApiService } from '../services/registro-api';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
  standalone: false,
})
export class ConsultaPage implements OnInit {
  registros: Registro[] = [];
  cargando = false;
  error = '';
  constructor(private api: RegistroApiService) {}
  ngOnInit() {
    this.cargarRegistros();
  }
  cargarRegistros() {
    this.cargando = true;
    this.api.listarRegistros().subscribe({
      next: (data) => (this.registros = data),
      error: () => (this.error = 'No se pudieron cargar registros.'),
      complete: () => (this.cargando = false),
    });
  }
}
