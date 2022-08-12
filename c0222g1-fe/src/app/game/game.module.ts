import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import {GameCreateComponent} from './component/game-create/game-create.component';
import {GameUpdateComponent} from './component/game-update/game-update.component';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [ GameCreateComponent , GameUpdateComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    ReactiveFormsModule
  ]
})
export class GameModule { }
