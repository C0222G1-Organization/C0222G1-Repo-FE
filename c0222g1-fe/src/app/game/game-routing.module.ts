import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {GameCreateComponent} from './component/game-create/game-create.component';
import {GameComponent} from './component/game/game.component';
import {GameUpdateComponent} from './component/game-update/game-update.component';
import {GameDetailComponent} from './component/game-detail/game-detail.component';
import {AuthGuardEmployeeAdminService} from '../authentication/service/auth-guard-employee-admin.service';



const routes: Routes = [
  {
    path: 'games/create',
    component: GameCreateComponent,
    canActivate: [AuthGuardEmployeeAdminService]
  },
  {
    path: 'games/edit/:id',
    component: GameUpdateComponent,
    canActivate: [AuthGuardEmployeeAdminService]
  },
  {
    path: 'games',
    component: GameComponent
  },
  {path: 'games/detail/:id', component: GameDetailComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule { }
