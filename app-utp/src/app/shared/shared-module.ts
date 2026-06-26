import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResumenRegistroComponent } from '../components/resumen-registro/resumen-registro.component';
import { SelectorTipoComponent } from '../components/selector-tipo/selector-tipo.component';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ResumenRegistroComponent, SelectorTipoComponent],
  imports: [CommonModule, IonicModule, FormsModule],
  exports: [ResumenRegistroComponent, SelectorTipoComponent],
})
export class SharedModule {}
