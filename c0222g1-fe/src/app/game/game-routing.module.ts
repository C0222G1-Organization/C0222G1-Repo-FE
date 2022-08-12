import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameCreateComponent} from './component/game-create/game-create.component';
import {GameComponent} from "./component/game/game.component";


const routes: Routes = [
  {
    path: 'games/create',
    component: GameCreateComponent
  },
  {
    path: 'games',
    component: GameComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
