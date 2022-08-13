import { Component, OnInit } from '@angular/core';
import {GameCategory} from '../../model/game-category';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../service/game.service';
import {GameCategoryService} from '../../service/game-category.service';
import {ToastrService} from 'ngx-toastr';
import {AngularFireStorage} from '@angular/fire/storage';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-game-update',
  templateUrl: './game-update.component.html',
  styleUrls: ['./game-update.component.css']
})
export class GameUpdateComponent implements OnInit {
  id: number;
  title = 'cloudsSorage';
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  gameCategory: GameCategory[];
  gameForm = new FormGroup({
    name: new FormControl(),
    createDate: new FormControl(),
    playedTimes: new FormControl(0),
    trailerUrl: new FormControl(),
    imageUrl: new FormControl(),
    content: new FormControl(),
    gameCategory: new FormGroup({
      id: new FormControl()
    })
  });
  constructor(private gameService: GameService,
              private gameCategoryService: GameCategoryService,
              private toastr: ToastrService,
              private storage: AngularFireStorage,
              private activatedRoute: ActivatedRoute,
              private route: Router) {
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    console.log(this.id);
    this.getAllGameCategory();
    this.getGame(this.id);
  }

  private getAllGameCategory() {
    this.gameCategoryService.getAll().subscribe(gameCategory => {
      this.gameCategory = gameCategory;
    });
  }

  private getGame(id: number) {
  this.gameService.findById(id).subscribe(game => {
    this.gameForm.patchValue(game);
    console.log('check' + id);
    console.log(this.gameForm);
  });
  }
  onFileSelected(event) {
    const n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    console.log('check');
    task
      .snapshotChanges()
      .pipe(
        finalize(() => {
          this.downloadURL = fileRef.getDownloadURL();
          this.downloadURL.subscribe(url => {
            if (url) {
              this.fb = url;
              this.gameForm.patchValue({imageUrl: url});
            }
            console.log(this.fb);
          });
        })
      )
      .subscribe(url => {
        if (url) {
          console.log(url);
        }
      });
  }
  submit() {
    this.gameService.updateGame(this.id, this.gameForm.value).subscribe(ticket => {
        this.toastr.success('Updated successfully!', 'Game');
        this.route.navigateByUrl('/games');
      }
    );
  }
}
