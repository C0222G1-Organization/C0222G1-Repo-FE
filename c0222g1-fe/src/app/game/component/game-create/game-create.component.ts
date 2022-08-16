import {Component, OnInit} from '@angular/core';
import {Game} from '../../model/game';
import {GameCategory} from '../../model/game-category';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {GameService} from '../../service/game.service';
import {GameCategoryService} from '../../service/game-category.service';
import {finalize, min} from 'rxjs/operators';
import validate = WebAssembly.validate;
import {ToastrService} from 'ngx-toastr';
import {Observable} from 'rxjs';
import {AngularFireStorage} from '@angular/fire/storage';
import {formatDate} from '@angular/common';
import {Router} from '@angular/router';
import {Title} from '@angular/platform-browser';

@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.css']
})
export class GameCreateComponent implements OnInit {
  gameForm: FormGroup;
  count = 1;
  gameCategory: GameCategory[];
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  url: any;
  msg = '';
  regexImageUrl = false;

  constructor(private gameService: GameService,
              private gameCategoryService: GameCategoryService,
              private toastr: ToastrService,
              private storage: AngularFireStorage,
              private router: Router,
              private title: Title) {
    this.title.setTitle('Thêm mới thông tin game');
  }

  ngOnInit(): void {
    this.getAllGameCateGory();
    this.gameForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(150),
        Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ][A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ][a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$')]),
      createDate: new FormControl(this.getCurrentDateTime()),
      playedTimes: new FormControl(0),
      trailerUrl: new FormControl('', [Validators.required,
        Validators.pattern('https?:\\/\\/(www\\.)?' +
          '[-a-zA-Z0-9@:%._+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}b([-a-zA-Z0-9()@:%_+.~#?&//=]*)')]),
      imageUrl: new FormControl('', [Validators.required],),
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


  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      this.msg = 'Bạn phải chọn ảnh';
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

  create() {
    // if (this.gameForm.invalid) {
    //   this.toastr.error('Nhập đầy đủ thông tin.');
    //   return;
    // }
    const imageUrl = this.getCurrentDateTime() + this.selectedFile.name;
    const filePath = `game/${imageUrl}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(`game/${imageUrl}`, this.selectedFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.gameForm.patchValue({imageUrl: url});
          console.log(url);
          console.log(this.gameForm.value);
          this.gameService.createGame(this.gameForm.value).subscribe(
            () => {
              this.router.navigateByUrl('/games');
              this.toastr.success('Tạo mới thàng công.');
            },
            error => {
              this.toastr.error('Tạo mới thất bại thất bại, hãy thử lại.');
            }
          );
        });
      })
    ).subscribe(); }
}

