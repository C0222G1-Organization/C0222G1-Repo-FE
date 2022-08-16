import {Component, OnInit} from '@angular/core';
import {GameCategory} from '../../model/game-category';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../service/game.service';
import {GameCategoryService} from '../../service/game-category.service';
import {ToastrService} from 'ngx-toastr';
import {AngularFireStorage} from '@angular/fire/storage';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-game-update',
  templateUrl: './game-update.component.html',
  styleUrls: ['./game-update.component.css']
})
export class GameUpdateComponent implements OnInit {
  id: number;
  title = 'cloudsSorage';
  selectedFile: File = null;
  editImageState = false;
  url: any;
  msg = '';
  fb;
  trailerUrl = '';
  imageUrl = '';
  check: boolean;
  gameCategory: GameCategory[];
  gameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(5),
      Validators.maxLength(100), Validators.pattern('^[\\w\\s]+$')]),
    createDate: new FormControl(this.getCurrentDateTime()),
    playedTimes: new FormControl(0),
    trailerUrl: new FormControl('', [Validators.required,
      Validators.pattern('https?:\\/\\/(www\\.)?' +
        '[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}b([-a-zA-Z0-9()@:%_+.~#?&//=]*)')]),
    imageUrl: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    gameCategory: new FormGroup({
      id: new FormControl('', Validators.required)
    })
  });

  constructor(private gameService: GameService,
              private gameCategoryService: GameCategoryService,
              private toastr: ToastrService,
              private storage: AngularFireStorage,
              private activatedRoute: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.id = Number(this.activatedRoute.snapshot.params.id);
    console.log(this.id);
    this.getAllGameCategory();
    this.getGame(this.id);
    this.getGameById(this.id);
  }

  getCurrentDateTime(): string {
    return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
  }

  private getAllGameCategory() {
    this.gameCategoryService.getAll().subscribe(gameCategory => {
      this.gameCategory = gameCategory;
    });
  }

  private getGame(id: number) {
    this.gameService.findById(id).subscribe(game => {
      this.gameForm.patchValue(game);
      console.log(this.gameForm.get('imageUrl').value);
    });
  }

  getGameById(id: number) {
    this.gameService.findById(id).subscribe(game => {
      this.trailerUrl = game.trailerUrl;
    }, error => {
      this.router.navigateByUrl('/500');
    });
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  selectFile(event: any) {
    this.editImageState = true;
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      this.msg = 'You must select an image';
      return;
    }

    const mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);
    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.msg = '';
      this.url = reader.result;
    };
  }

  submit() {
    console.log(this.gameForm.value);
    const nameImage = this.getCurrentDateTime() + this.selectedFile.name;
    const filePath = `game/${nameImage}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(`game/${nameImage}`, this.selectedFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.gameForm.patchValue({imageUrl: url});
          console.log(url);
          console.log(this.gameForm.value);
          this.gameService.updateGame(this.id, this.gameForm.value).subscribe(
            () => {
              this.router.navigateByUrl('/games');
            }
          );
        });
      })
    ).subscribe();
  }
}
