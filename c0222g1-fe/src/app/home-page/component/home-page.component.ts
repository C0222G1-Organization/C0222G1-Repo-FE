import { Component, OnInit } from '@angular/core';
import {Game} from "../../game/model/game";
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";
import {HomePageService} from "../service/home-page.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css'],
})
export class HomePageComponent implements OnInit {
  page = 0;
  selectedId: number;
  selectedName: string;
  game: Game;
  popularGames: Game[] = [];
  top3Games: Game[] = [];
  newGames: Game[] = [];
  hotGames: Game[] = [];

  constructor(private toastr: ToastrService,
              private title: Title,
              private homePageService: HomePageService,
              private activatedRoute: ActivatedRoute,
              private route: Router) {
    this.title.setTitle('C02G1');
  }


  ngOnInit(): void {
    this.getAllPopularGames();
    this.getAllNewGames();
    this.getAllHotGames();
    this.getTop3Games();
  }

  getTop3Games() {
    this.homePageService.getTop3Games(0).subscribe((games: any) => {
      this.top3Games = games.content;
    });
  }

  getAllPopularGames() {
    this.homePageService.getAllPopularGames(this.page).subscribe((games: any) => {
      this.popularGames = games.content;
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }

  getAllNewGames() {
    this.homePageService.getAllNewGames(this.page).subscribe((games: any) => {
      this.newGames = games.content;
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }

  getAllHotGames() {
    this.homePageService.getAllHotGame(this.page).subscribe((games: any) => {
      this.hotGames = games.content;
    }, error => {
      this.route.navigateByUrl('/500');
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
    }, error => {
      this.toastr.error("Xóa thất bại");
    });
  }

  updatePlayedTimes(id: number) {
    this.homePageService.updateGame(id, this.game).subscribe(res => {
      this.toastr.success("Đang khởi động game");
      this.getAllHotGames();
      this.getAllNewGames();
      this.getAllPopularGames();
    }, error => {
      this.toastr.error("Khởi động thất bại");
    })
  }

  getGameAndUpdate(id: number) {
    console.log('dang bam')
    this.homePageService.findById(id).subscribe(game => {
      this.game = game;
      this.game.playedTimes += 1;
      this.updatePlayedTimes(id);
    }, error => {
      console.log('error')
    });
  }
}
