import {Component, OnInit} from '@angular/core';
import {Game} from '../../model/game';
import {GameService} from '../../service/game.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})

export class GameDetailComponent implements OnInit {
  game: Game;
  id: number;
  trailerUrl = '';

  constructor(
    private gameService: GameService,
    private activatedRoute: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    this.getGameById(this.id);
  }

  getGameById(id: number) {
    this.gameService.findById(id).subscribe(game => {
      console.log('check' + id);
      this.game = game;
      this.trailerUrl = game.trailerUrl;
    });
  }
}
