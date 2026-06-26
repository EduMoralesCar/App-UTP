import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroApiService } from '../services/registro-api';
import { Registro } from '../models/registro';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  enviado = false;
  cargando = false;
  mensaje = '';
  error = '';

  // Stats variables
  totalRegistros = 0;
  acadRegistros = 0;
  ventasRegistros = 0;
  porcentajeAcad = 0;
  porcentajeVentas = 0;

  registroForm = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(3)]],
    correo: ['', [Validators.required, Validators.email]],
    tipoApp: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private api: RegistroApiService,
  ) {}

  ngOnInit() {
    this.cargarEstadisticas();
  }

  ionViewWillEnter() {
    this.cargarEstadisticas();
  }

  cargarEstadisticas() {
    this.api.listarRegistros().subscribe({
      next: (registros) => {
        if (registros) {
          this.totalRegistros = registros.length;
          this.acadRegistros = registros.filter(r => r.tipoApp === 'academica').length;
          this.ventasRegistros = registros.filter(r => r.tipoApp === 'ventas').length;
          this.porcentajeAcad = this.totalRegistros > 0 ? (this.acadRegistros / this.totalRegistros) : 0;
          this.porcentajeVentas = this.totalRegistros > 0 ? (this.ventasRegistros / this.totalRegistros) : 0;
        }
      },
      error: () => {
        console.log('No se pudieron cargar las estadísticas para el dashboard.');
      }
    });
  }

  get f() {
    return this.registroForm.controls;
  }

  seleccionarTipoApp(tipo: string) {
    this.registroForm.patchValue({ tipoApp: tipo });
    this.registroForm.get('tipoApp')?.markAsTouched();
  }

  validarRegistro() {
    this.enviado = true;
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    console.log('Registro válido', this.registroForm.value);
    this.mensaje = '¡Los datos del formulario son válidos!';
    setTimeout(() => this.limpiarMensajes(), 3000);
  }

  continuarADetalle() {
    this.enviado = true;
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    this.router.navigate(['/detalle'], {
      queryParams: this.registroForm.value,
    });
  }

  guardarEnNube() {
    this.enviado = true;
    this.limpiarMensajes();

    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.cargando = true;
    const registro = this.registroForm.value as Registro;

    this.api.guardarRegistro(registro).subscribe({
      next: (resp) => {
        this.mensaje = resp.mensaje || '¡Registro guardado en la nube con éxito!';
        this.cargarEstadisticas();
        setTimeout(() => {
          this.router.navigate(['/detalle'], { queryParams: registro });
        }, 1500);
      },
      error: () => {
        this.error = 'No se pudo conectar con el servidor. Se guardó localmente.';
        this.cargando = false;
        // Navegamos de todos modos con los datos locales
        setTimeout(() => {
          this.router.navigate(['/detalle'], { queryParams: registro });
        }, 1500);
      },
      complete: () => (this.cargando = false),
    });
  }

  limpiarMensajes() {
    this.mensaje = '';
    this.error = '';
  }

  limpiarFormulario() {
    this.registroForm.reset();
    this.enviado = false;
    this.limpiarMensajes();
  }
}
