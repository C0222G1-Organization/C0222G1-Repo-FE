import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameCreateComponent} from './component/game-create/game-create.component';
import {GameComponent} from "./component/game/game.component";
import {GameUpdateComponent} from "./component/game-update/game-update.component";


const routes: Routes = [
  {
    path: 'games/create',
    component: GameCreateComponent
  },
  {
    path: 'games/edit/:id',
    component: GameUpdateComponent
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
