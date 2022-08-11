import { Component, OnInit } from '@angular/core';
// @ts-ignore
import {Game} from '../model/game';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';
import {GameService} from '../service/game.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  page = 0;
  popularGames: Game[];
  newGames: Game[];
  hotGames: Game[];
  constructor(private toastr: ToastrService,
              private title: Title,
              private gameService: GameService) {
    this.title.setTitle('C02G1 | Home');
  }

  ngOnInit(): void {
    this.getAllPopularGames();
    this.getAllNewGames();
    this.getAllHotGames();
  }

  getAllPopularGames() {
    this.gameService.getAllPopularGames(this.page).subscribe((games: any) => {
      console.log(games.content);
      this.popularGames = games.content;
    });
  }

  getAllNewGames() {
    this.gameService.getAllNewGames(this.page).subscribe((games: any) => {
      this.newGames = games.content;
    });
  }

  getAllHotGames() {
    this.gameService.getAllHotGame(this.page).subscribe((games: any) => {
      this.hotGames = games.content;
    });
  }

}
