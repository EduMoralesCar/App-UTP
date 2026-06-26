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
  registrosFiltrados: Registro[] = [];
  cargando = false;
  error = '';
  
  terminoBusqueda = '';
  filtroTipo = 'todos';

  constructor(private api: RegistroApiService) {}

  ngOnInit() {
    this.cargarRegistros();
  }

  ionViewWillEnter() {
    this.cargarRegistros();
  }

  cargarRegistros() {
    this.cargando = true;
    this.error = '';
    this.api.listarRegistros().subscribe({
      next: (data) => {
        this.registros = data || [];
        this.filtrarRegistros();
      },
      error: () => {
        this.error = 'No se pudieron cargar registros desde la nube.';
        this.cargando = false;
        // fallback still allows filtering on whatever is returned
        this.filtrarRegistros();
      },
      complete: () => (this.cargando = false),
    });
  }

  filtrarRegistros(event?: any) {
    if (event) {
      this.terminoBusqueda = event.target.value || '';
    }

    this.registrosFiltrados = this.registros.filter((reg) => {
      const nombreValido = reg.nombre || '';
      const correoValido = reg.correo || '';
      const tipoValido = reg.tipoApp || '';

      const cumpleBusqueda =
        nombreValido.toLowerCase().includes(this.terminoBusqueda.toLowerCase()) ||
        correoValido.toLowerCase().includes(this.terminoBusqueda.toLowerCase());

      const cumpleTipo =
        this.filtroTipo === 'todos' ||
        tipoValido === this.filtroTipo;

      return cumpleBusqueda && cumpleTipo;
    });
  }

  getIniciales(nombre: string): string {
    if (!nombre) return 'U';
    const partes = nombre.trim().split(' ');
    if (partes.length >= 2) {
      return (partes[0].charAt(0) + partes[1].charAt(0)).toUpperCase();
    }
    return nombre.charAt(0).toUpperCase();
  }
}
