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
  progressWidth2: number;
  progressWidth3: number;
  progressWidth4: number;
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
    this.homePageService.getTop3Games(0).subscribe((games: any) => {
      this.topCarouselGames = games.content;
      this.activeCarouselUrl = this.topCarouselGames[0].imageUrl;
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
    if (sessionStorage.getItem('roles') == 'EMPLOYEE' || sessionStorage.getItem('roles') == 'ADMIN') {
      this.editState = true;
      this.playState = true;
    }
    if (sessionStorage.getItem('roles') == 'CUSTOMER') {
      this.playState = true;
      this.editState = false;
    }
  }

  changeProgress() {
    this.progressWidth = 0;
    this.progressWidth2 = 0;
    this.progressWidth3 = 0;
    this.progressWidth4 = 0;
    let index = 0;
    setInterval(() => {
      if (this.progressWidth != 100 && this.progressWidth2 == 0 && this.progressWidth3 == 0 && this.progressWidth4 == 0) {
        this.progressWidth += 0.5;
      } else if (this.progressWidth == 100){
        this.progressWidth = 0;
        this.activeCarouselUrl = this.topCarouselGames[1].imageUrl;
      }

      if (this.progressWidth2 != 100 && this.progressWidth == 0 && this.progressWidth3 == 0 && this.progressWidth4 == 0) {
        this.progressWidth = 0;
        this.progressWidth2 += 0.5;
      } else if (this.progressWidth2 == 100){
        this.progressWidth2 = 0;
        this.activeCarouselUrl = this.topCarouselGames[2].imageUrl;
      }

      if (this.progressWidth3 != 100 && this.progressWidth2 == 0  && this.progressWidth == 0 && this.progressWidth4 == 0) {
        this.progressWidth2 = 0;
        this.progressWidth3 += 0.5;
      } else if (this.progressWidth3 == 100){
        this.progressWidth3 = 0;
        this.activeCarouselUrl = this.topCarouselGames[3].imageUrl;
      }

      if (this.progressWidth4 != 100 && this.progressWidth2 == 0  && this.progressWidth == 0 && this.progressWidth3 == 0) {
        this.progressWidth3 = 0;
        this.progressWidth4 += 0.5;
      } else if (this.progressWidth4 == 100){
        this.progressWidth4 = 0;
        this.activeCarouselUrl = this.topCarouselGames[0].imageUrl;
      }
    }, 25);

    // setInterval(() => {
    //   if (index != 4) {
    //     this.activeCarouselUrl = this.top3Games[index].imageUrl;
    //     index += 1;
    //   } else {
    //     index = 0;
    //   }
    // }, 2600)
  }
}
