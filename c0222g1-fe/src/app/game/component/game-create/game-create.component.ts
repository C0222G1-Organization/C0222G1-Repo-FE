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
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
@Component({
  selector: 'app-game-create',
  templateUrl: './game-create.component.html',
  styleUrls: ['./game-create.component.css']
})
export class GameCreateComponent implements OnInit {
  public Editor = ClassicEditor;
  gameForm: FormGroup;
  gameCategory: GameCategory[];
  selectedFile: File = null;
  fb;
  downloadURL: Observable<string>;
  url: any;
  msg = '';
  checkImgSize = false;
  checkImg: boolean;
  regexImg = false;
  isExitsGameName = false;
  check = true;
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
      name: new FormControl('', [Validators.required, Validators.minLength(2), Validators.maxLength(150)]),
      createDate: new FormControl(this.getCurrentDateTime()),
      playedTimes: new FormControl(0),
      trailerUrl: new FormControl('', [Validators.required,
        Validators.pattern('^https:\\/\\/www\\.youtube\\.com\\/embed\\/\\S*$')]),
      imageUrl: new FormControl('', [Validators.required], ),
      content: new FormControl('', [Validators.required , Validators.minLength(15)]),
      gameCategory: new FormGroup({
        id: new FormControl('', Validators.required)
      }),
      deleteStatus: new FormControl(false)
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
    this.regexImg = false;
    if (event.target.files[0].size > 9000000) {
      return;
    }
    if (!event.target.files[0].name.match('^.*\\.(jpg|JPG)$')) {
      this.regexImg = true;
      return;
    }
    this.selectedFile = event.target.files[0];
    this.gameForm.patchValue({imageUrl: this.selectedFile.name});
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    if (event.target.files[0].size > 9000000) {
      this.checkImgSize = true;
      return;
    }
    if (!event.target.files[0].name.match('^.*\\.(jpg|JPG)$')) {
      return;
    }
    this.checkImgSize = false;
    this.checkImg = false;

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
    this.check = false;
    if (this.gameForm.invalid) {
      this.toastr.error('Nhập đầy đủ thông tin.');
      this.check = true;
      return;
    }
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
              this.toastr.error('Tạo mới thất bại');
            }
          );
        });
      })
    ).subscribe(); }
  checkImage() {
    if (!this.selectedFile || this.selectedFile.name === '') {
      this.checkImg = true;
      return;
    }
  }
  checkGameName($event: Event) {
    this.gameService.checkGameName(String($event)).subscribe(
      value => {
        if (value) {
          this.isExitsGameName = true;
        } else {
          this.isExitsGameName = false;
        }
      }
    );
    if (String($event) === '') {
      this.isExitsGameName = false;
    }
  }
}
