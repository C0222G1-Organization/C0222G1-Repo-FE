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
  itemsPerPage = 2;
  totalPages;
  selectedId: number;
  selectedGames: any[] = [];
  selectedName: string;
  games: Game[];
  gameName = '';
  game: Game;
  checked: boolean;
  deleteState: boolean;

  constructor(private gameService: GameService,
              private title: Title,
              private toastr: ToastrService) {
    this.title.setTitle('C02G1 | Game');
  }

  ngOnInit(): void {
    this.getGames();
    this.deleteState = true;
  }

  getGames() {
    this.gameService.getAllGames(0).subscribe((games: any) => {
      this.games = games.content;
      this.totalItems = games.totalElements;
      this.totalPages = games.totalPages;
    });
  }

  getPage(page) {
    if (page < 1 || page > this.totalPages) {
      this.toastr.error("Vui lòng nhập đúng");
    }
    this.page = page;
    page = page - 1;
    this.gameService.getAllGames(page).subscribe((games: any) => {
      this.games = games.content;
      this.totalItems = games.totalElements;
      this.totalPages = games.totalPages;
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
      this.totalPages = games.totalPages;
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
      this.toastr.success('Xóa thành công');
    }, error => {
      this.toastr.error("Xóa thất bại");
    });
  }

  updatePlayedTimes(id: number) {
    this.gameService.updateGame(id, this.game).subscribe(res => {
      this.getGames();
      this.toastr.success("Đang khởi động game")
    }, error => {
      this.toastr.error("Khởi động thất bại");
    })
  }

  getGameAndUpdate(id: number) {
    this.gameService.findById(id).subscribe(game => {
      this.game = game;
      this.game.playedTimes += 1;
      this.updatePlayedTimes(id);
    }, error => {
      console.log('error')
    });
  }

  isAllCheckBoxChecked() {
    if (this.games.length !== 0) {
      return this.games.every(g => g.checked);
    }
  }

  checkMultipleCheckBox(event: any) {
    this.games.forEach(x => x.checked = event.target.checked);
  }

  getSelectedGames() {
    this.selectedGames = this.games.filter(game => game.checked);
  }

  deleteMultipleGames() {
    for (const selectedGame of this.selectedGames) {
      this.gameService.deleteGameById(selectedGame.id).subscribe(res => {
        this.page = 1;
        this.getGames();
        console.log('Xóa thành công');
      }, error => {
        console.log('Xóa thất bại');
      });
    }
    this.deleteState = false;
    this.toastr.success("Xóa thành công");
  }
}
