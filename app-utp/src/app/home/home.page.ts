import { Component } from '@angular/core';
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
export class HomePage {
  enviado = false;
  cargando = false;
  mensaje = '';
  error = '';

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
  get f() {
    return this.registroForm.controls;
  }

  validarRegistro() {
    this.enviado = true;
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }
    console.log('Registro válido', this.registroForm.value);
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
        this.mensaje = resp.mensaje || 'Registro guardado correctamente.';
        this.router.navigate(['/detalle'], { queryParams: registro });
      },
      error: () => (this.error = 'No se pudo conectar con el endpoint.'),
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
