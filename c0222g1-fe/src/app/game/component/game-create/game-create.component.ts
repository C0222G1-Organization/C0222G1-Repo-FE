import {Component, OnInit} from '@angular/core';
import {Game} from '../../model/game';
import {GameCategory} from '../../model/game-category';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../service/game.service';
import {GameCategoryService} from '../../service/game-category.service';
import {finalize, min} from 'rxjs/operators';
import validate = WebAssembly.validate;
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {formatDate} from '@angular/common';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.css']
})
export class GameCreateComponent implements OnInit {
  gameForm: FormGroup;
  count = 1;
  gameCategory: GameCategory[];
  title = 'cloudsSorage';
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  url: any;
  msg = '';

  constructor(private gameService: GameService,
              private gameCategoryService: GameCategoryService,
              private toastr: ToastrService,
              private storage: AngularFireStorage) {
  }

  ngOnInit(): void {
    this.getAllGameCateGory();
    this.gameForm = new FormGroup({
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
  }

  getAllGameCateGory() {
    this.gameCategoryService.getAll().subscribe(gameCategory => {
      this.gameCategory = gameCategory;
    });
  }
  getCurrentDateTime(): string {
    return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
  }
  // show image
  selectFile(event: any) {
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
  // firebase
  onFileSelected(event) {
    const n = Date.now();
    const file = event.target.files[0];
    const filePath = `RoomsImages/${n}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`RoomsImages/${n}`, file);
    console.log('check!');
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

  addNewGame() {
    console.log(this.gameForm.value);
    this.gameService.createGame(this.gameForm.value)
      .subscribe(
        response => {
          console.log(response);
          this.toastr.success('Tạo mới thành công!!');
        },
        error => {
          console.log(error);
        });
    this.gameForm.reset();
  }
}

