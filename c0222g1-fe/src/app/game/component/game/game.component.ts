import {Component, OnInit} from '@angular/core';
import {Game} from "../../model/game";
import {GameService} from "../../service/game.service";
import {Title} from "@angular/platform-browser";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  page = 0;
  totalItems: any;
  itemsPerPage = 8;
  selectedId: number;
  selectedName: string;
  games: Game[];
  gameName = '';
  playedTimes: number;
  constructor(private gameService: GameService,
              private title: Title,
              private toastr: ToastrService) {
    this.title.setTitle('C02G1 | Game');
  }

  ngOnInit(): void {
    this.getGames();
    this.changePlayedTime();
  }

  getGames() {
    this.gameService.getAllGames(0).subscribe((games: any) => {
      console.log(games.content);
      this.games = games.content;
      this.totalItems = games.totalElements;
    });
  }

  getPage(page) {
    this.page = page;
    page = page - 1;
    this.gameService.getAllGames(page).subscribe((games: any) => {
      this.games = games.content;
      this.totalItems = games.totalElements;
    });
  }

  searchGameByName() {
    if (this.gameName == '') {
      this.getGames();
    }
    this.gameService.searchGameByName(this.gameName).subscribe((games: any) => {
      this.games = games.content;
      this.page = 1;
      this.totalItems = games.totalElements;
    });
  }

  getInfoGame(id: number, name: string) {
    this.selectedId = id;
    this.selectedName = name;
  }

  deleteGameById() {
    this.gameService.deleteGameById(this.selectedId).subscribe(res => {
      this.page = 1;
      this.getGames();
      this.toastr.success('Xóa thành công!', 'Game');
    });
  }
  changePlayedTime() {
    this.playedTimes = this.playedTimes + 1;
  }
}
