import {Component, OnInit, ViewChild} from '@angular/core';
import {Game} from '../../model/game';
import {GameService} from '../../service/game.service';
import {Title} from '@angular/platform-browser';
import {ToastrService} from 'ngx-toastr';

import {Route, Router} from '@angular/router';
import {GameCreateComponent} from "../game-create/game-create.component";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  page = 1;
  totalItems: any;
  itemsPerPage = 8;
  totalPages;
  selectedId: number;
  selectedGames: any[] = [];
  selectedName: string;
  games: Game[] = [];
  gameName = '';
  game: Game;
  checked: boolean;
  editState = false;
  playState = false;

  constructor(private gameService: GameService,
              private title: Title,
              private toastr: ToastrService,
              private route: Router) {
    this.title.setTitle('Danh sách game');
  }

  ngOnInit(): void {
    this.getGames(this.page - 1);
    this.checkRole();
  }


  getGames(page: number) {
    this.gameService.getAllGames(page).subscribe((games: any) => {
      if (games != null) {
        this.games = games.content;
        this.totalItems = games.totalElements;
        this.totalPages = games.totalPages;
      } else {
        if (page > 0) {
          this.getGames(page - 1);
          this.page = page;
        }
      }
    }, error => {
      this.route.navigateByUrl('/500');
    });
  }

  getPage(page) {
    if (page < 1 || page > this.totalPages) {
      this.toastr.error('Vui lòng nhập đúng');
      this.toastr.error('Vui lòng nhập đúng');
    } else {
      this.page = page;
      if (this.gameName.length !== 0) {
        this.searchGameByName();
      } else {
        this.gameService.getAllGames(this.page - 1).subscribe((games: any) => {
          this.games = games.content;
          this.totalItems = games.totalElements;
          this.totalPages = games.totalPages;
        });
      }
    }
  }

  searchGameByName() {
    if (this.gameName === '') {
      this.getGames(0);
    } else {
      this.gameName = this.gameName.trim();
      this.gameService.searchGameByName(this.gameName, this.page - 1).subscribe((games: any) => {
        if (games == null) {
          if (this.page > 1) {
            this.page = this.page - 1;
            this.gameService.searchGameByName(this.gameName, this.page - 1).subscribe((games: any) => {
              this.games = games.content;
              this.totalItems = games.totalElements;
              this.totalPages = games.totalPages;
            });
          } else {
            this.games = [];
          }
          this.games = [];
        } else {
          this.games = games.content;
          this.totalItems = games.totalElements;
          this.totalPages = games.totalPages;
        }
      });
    }
  }

  getInfoGame(id: number, name: string) {
    this.selectedId = id;
    this.selectedName = name;
  }

  deleteGameById() {
    this.gameService.deleteGameById(this.selectedId).subscribe(res => {
      this.toastr.success('Xóa thành công');
      if (this.gameName == '') {
        this.getGames(this.page - 1);
      } else {
        this.searchGameByName();
      }
    }, error => {
      this.toastr.error('Xóa thất bại');
    });
  }

  updatePlayedTimes(id: number) {
    this.gameService.updateGame(id, this.game).subscribe(res => {
        this.getGames(this.page - 1);
        this.toastr.success('Đang tải game');
    }, error => {
      this.toastr.error('Tải thất bại');
    });
  }

  getGameAndUpdate(id: number) {
    if (this.playState === true) {
      this.gameService.findById(id).subscribe(game => {
        this.game = game;
        this.game.playedTimes += 1;
        this.updatePlayedTimes(id);
      }, error => {
        console.log('error');
      });
    } else {
      this.toastr.error('Bạn cần phải đăng nhập');
    }
  }

  checkGame(id: number) {
    for (const game of this.games) {
      if (game.id === id) {
        game.checked = game.checked !== true;
        break;
      }
    }
    this.getSelectedGames();
  }

  isAllCheckBoxChecked() {
    if (this.games.length !== 0) {
      return this.games.every(g => g.checked);
    }
  }

  checkMultipleCheckBox(event: any) {
    this.games.forEach(x => x.checked = event.target.checked);
    this.getSelectedGames();
  }

  getSelectedGames() {
    this.selectedGames = this.games.filter(game => game.checked);
  }

  deleteMultipleGames() {
    for (const selectedGame of this.selectedGames) {
      this.gameService.deleteGameById(selectedGame.id).subscribe(res => {
        if (this.gameName === '') {
          this.getGames(this.page - 1);
        } else {
          this.searchGameByName();
        }
        console.log('Xóa thành công');
      }, error => {
        console.log('Xóa thất bại');
      });
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

  updateGameListAfterCreated(game: Game) {
    console.log('update nek');
    this.games.push(game);
  }

  findGameById(id: number) {
    this.gameService.findById(id).subscribe(game => {this.game = game});
  }
}
