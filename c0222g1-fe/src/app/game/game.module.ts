import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GameRoutingModule } from './game-routing.module';
import {GameCreateComponent} from './component/game-create/game-create.component';
import {GameUpdateComponent} from './component/game-update/game-update.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { GameComponent } from './component/game/game.component';
import {NgxPaginationModule} from "ngx-pagination";


@NgModule({
  declarations: [ GameCreateComponent , GameUpdateComponent, GameComponent],
  imports: [
    CommonModule,
    GameRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxPaginationModule
  ]
})
export class GameModule { }
