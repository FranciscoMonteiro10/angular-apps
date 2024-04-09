// core.module.ts
import { NgModule } from '@angular/core';
import { TickTackToeComponent } from './components/tick-tack-toe/tick-tack-toe.component';

@NgModule({
  declarations: [],
  imports: [TickTackToeComponent],
  exports: [TickTackToeComponent],
})
export class CoreModule {}
