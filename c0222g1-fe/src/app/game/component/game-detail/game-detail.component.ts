import {Component, OnInit} from '@angular/core';
import {Game} from '../../model/game';
import {GameService} from '../../service/game.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from "ngx-toastr";
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-game-detail',
  templateUrl: './game-detail.component.html',
  styleUrls: ['./game-detail.component.css']
})

export class GameDetailComponent implements OnInit {
  game: Game;
  id: number;
  playState = false;
  editState = false;
  selectedName: string;
  selectedId: number;

  constructor(
    private gameService: GameService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private title: Title
  ) {
    this.title.setTitle('Chi tiết game');
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    this.getGameById(this.id);
    this.checkRole();
  }

  getGameById(id: number) {
    this.gameService.findById(id).subscribe(game => {
      this.game = game;
    });
  }

  playGame() {
    if (this.playState){
      this.game.playedTimes += 1;
      this.gameService.updateGame(this.game.id, this.game).subscribe(res => {
        this.toastr.success('Đang khởi động game');
        this.getGameById(this.id);
      }, error => {
        this.toastr.error('Khởi động thất bại');
      });
    } else {
      this.toastr.error('Bạn cần phải đăng nhập');
    }
  }

  checkRole() {
    if (sessionStorage.getItem('roles') === 'EMPLOYEE' || sessionStorage.getItem('roles') == 'ADMIN') {
      this.editState = true;
      this.playState = true;
    }
    if (sessionStorage.getItem('roles') === 'CUSTOMER') {
      this.playState = true;
      this.editState = false;
    }
  }

  editGame(id: number) {
    id = Number(id);
    this.router.navigateByUrl('games/edit/' + id);
  }

  getInfoGame(id: number, name: string) {
    this.selectedId = id;
    this.selectedName = name;
  }

  deleteGameById() {
    this.gameService.deleteGameById(this.selectedId).subscribe(res => {
      this.toastr.success('Xóa thành công');
      this.router.navigateByUrl('/games');
    }, error => {
      this.toastr.error('Xóa thất bại');
    });
  }
}
