import {Component, OnInit} from '@angular/core';
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
  topCarouselGames: Game[] = [];
  newGames: Game[] = [];
  hotGames: Game[] = [];
  editState = false;
  playState = false;
  progressWidth: number;
  activeCarouselGameId: number;
  activeCarouselUrl = '';

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
    this.getCarouselGames();
    this.checkRole();
    this.changeProgress();
  }

  getCarouselGames() {
    this.homePageService.getTopGames(0).subscribe((games: any) => {
      if (games != null) {
        this.topCarouselGames = games.content;
        this.activeCarouselUrl = this.topCarouselGames[0].imageUrl;
        this.activeCarouselGameId = this.topCarouselGames[0].id;
      }
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
      this.toastr.success("Đang tải game");
      this.getAllHotGames();
      this.getAllNewGames();
      this.getAllPopularGames();
    }, error => {
      this.toastr.error("Bạn cần đăng nhập");
    })
  }

  getGameAndUpdate(id: number) {
    if (this.playState == true) {
      this.homePageService.findById(id).subscribe(game => {
        this.game = game;
        this.game.playedTimes += 1;
        this.updatePlayedTimes(id);
      }, error => {
        console.log('error')
      });
    } else {
      this.toastr.error("Bạn cần phải đăng nhập");
    }
  }

  checkRole() {
    if (localStorage.getItem('roles') == 'EMPLOYEE' || localStorage.getItem('roles') == 'ADMIN') {
      this.editState = true;
      this.playState = true;
    }
    if (localStorage.getItem('roles') == 'CUSTOMER') {
      this.playState = true;
      this.editState = false;
    }
  }

  changeProgress() {
    this.progressWidth = 0;
    let index = 0;
    setInterval(() => {
      if (this.progressWidth != 100){
        this.progressWidth += 0.5;
      } else {
        this.progressWidth = 0;
        index += 1;
        if (index != this.topCarouselGames.length){
          this.activeCarouselUrl = this.topCarouselGames[index].imageUrl;
          this.activeCarouselGameId = this.topCarouselGames[index].id;
        } else {
          index = 0;
          this.activeCarouselUrl = this.topCarouselGames[index].imageUrl;
          this.activeCarouselGameId = this.topCarouselGames[index].id;
        }
      }
    }, 20);
  }

  enableProgress(i: number) {
    if (this.activeCarouselUrl == this.topCarouselGames[i].imageUrl) {
      return true;
    } else {
      return false;
    }
  }

  playGame() {
    this.getGameAndUpdate(this.activeCarouselGameId);
  }
}
