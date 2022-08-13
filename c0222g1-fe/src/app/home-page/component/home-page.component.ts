import { Component, OnInit } from '@angular/core';
import {Game} from "../../game/model/game";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {HomePageService} from "../service/home-page.service";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  page = 0;
  selectedId: number;
  selectedName: string;
  game: Game;
  popularGames: Game[];
  newGames: Game[];
  hotGames: Game[];
  constructor(private toastr: ToastrService,
              private title: Title,
              private homePageService: HomePageService,
              private activatedRoute: ActivatedRoute) {
    this.title.setTitle('C02G1 | Home');
  }

  ngOnInit(): void {
    this.getAllPopularGames();
    this.getAllNewGames();
    this.getAllHotGames();
  }

  getAllPopularGames() {
    this.homePageService.getAllPopularGames(this.page).subscribe((games: any) => {
      this.toastr.success("Tải trang thành công");
      this.popularGames = games.content;
    });
  }

  getAllNewGames() {
    this.homePageService.getAllNewGames(this.page).subscribe((games: any) => {
      this.newGames = games.content;
    });
  }

  getAllHotGames() {
    this.homePageService.getAllHotGame(this.page).subscribe((games: any) => {
      this.hotGames = games.content;
    });
  }

  getInfoGame(id: number, name: string) {
    this.selectedId = id;
    this.selectedName = name;
  }

  deleteGameById() {
    this.homePageService.deleteGameById(this.selectedId).subscribe(res => {
      this.getAllPopularGames();
      this.getAllNewGames();
      this.getAllHotGames();
      this.toastr.success("Xóa thành công");
    });
  }

  updatePlayedTimes(id: number) {
    this.homePageService.updateGame(id, this.game).subscribe(res => {
      console.log('ok');
      this.getAllHotGames();
      this.getAllNewGames();
      this.getAllPopularGames();
    })
  }

  getGameAndUpdate(id: number) {
    this.homePageService.findById(id).subscribe(game => {
      this.game = game;
      this.game.playedTimes += 1;
      this.updatePlayedTimes(id);
    }, error => {
      console.log('error')
    });
  }
}
