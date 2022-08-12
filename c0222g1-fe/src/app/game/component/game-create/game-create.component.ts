import {Component, OnInit} from '@angular/core';
import {Game} from '../../model/game';
import {GameCategory} from '../../model/game-category';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../service/game.service';
import {GameCategoryService} from '../../service/game-category.service';
import {min} from 'rxjs/operators';
import validate = WebAssembly.validate;

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.css']
})
export class GameCreateComponent implements OnInit {
  gameForm: FormGroup;
  gameCategory: GameCategory[];

  constructor(private gameService: GameService,
              private gameCategoryService: GameCategoryService) {
  }

  ngOnInit(): void {
    this.getAllGameCateGory();
    this.gameForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5 ),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
      createDate: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
      playedTimes: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
      trailerUrl: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
      imageUrl: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
      content: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
      gameCategory: new FormControl('', [Validators.required, Validators.minLength(1),
        Validators.maxLength(20), Validators.pattern('^[\\w\\s]+$')]),
    });
  }
   getAllGameCateGory() {
     this.gameCategoryService.getAll().subscribe(gameCategory => {
       this.gameCategory = gameCategory;
     });
  }
  submit() {
    this.gameService.createGame(this.gameForm.value).subscribe(ticket => {
        // this.toastr.success('Created successfully!', 'Ticket');
        this.gameForm.reset();
        // this.route.navigateByUrl('/ticket');
      }
    );
  }
}

