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
import {Title} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';


@Component({
  selector: 'app-game-update',
  templateUrl: './game-update.component.html',
  styleUrls: ['./game-update.component.css']
})
export class GameUpdateComponent implements OnInit {
  public Editor = ClassicEditor;
  id: number;
  selectedFile: File = null;
  editImageState = false;
  url: any;
  msg = '';
  fb;
  trailerUrl = '';
  imageUrl = '';
  checkImg: boolean;
  checkImgSize = false;
  check = true;
  regexImageUrl = false;
  isExitsGameName = false;
  gameCategory: GameCategory[];
  gameForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(150)]),
    createDate: new FormControl(this.getCurrentDateTime()),
    playedTimes: new FormControl(0),
    trailerUrl: new FormControl('', [Validators.required,
      Validators.pattern('^https:\\/\\/www\\.youtube\\.com\\/embed\\/\\S*$')]),
    imageUrl: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required, Validators.minLength(15)]),
    gameCategory: new FormGroup({
      id: new FormControl('', Validators.required)
    })
  });

  constructor(private gameService: GameService,
              private gameCategoryService: GameCategoryService,
              private toastr: ToastrService,
              private storage: AngularFireStorage,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private title: Title) {
    this.title.setTitle('Chỉnh sửa thông tin game');
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
    this.regexImageUrl = false;
    if (event.target.files[0].size > 9000000) {
      return;
    }
    this.selectedFile = event.target.files[0];
    if (!event.target.files[0].name.match('^.*\\.(jpg|JPG)$')) {
      this.regexImageUrl = true;
      return;
    }
    this.gameForm.patchValue({imageUrl: this.selectedFile.name});
  }

  selectFile(event: any) {
    if (!event.target.files[0] || event.target.files[0].length === 0) {
      return;
    }
    if (event.target.files[0].size > 9000000) {
      return;
    }
    if (!event.target.files[0].name.match('^.*\\.(jpg|JPG)$')) {
      return;
    }
    this.checkImgSize = false;
    this.checkImg = false;
    this.editImageState = true;

    const mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Chỉ có file ảnh được hỗ trợ';
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
    this.check = false;
    if (this.gameForm.invalid) {
      this.toastr.error('Nhập đầy đủ thông tin!');
      this.check = true;
      return;
    }
    if (this.selectedFile !== null) {
      const imageUrl = this.getCurrentDateTime() + this.selectedFile.name;
      const filePath = `game/${imageUrl}`;
      const fileRef = this.storage.ref(filePath);
      this.storage.upload(`game/${imageUrl}`, this.selectedFile).snapshotChanges().pipe(
        finalize(() => {
          fileRef.getDownloadURL().subscribe((url) => {
            this.gameForm.patchValue({imageUrl: url});
            console.log(url);
            console.log(this.gameForm.value);
            this.gameService.updateGame(this.id, this.gameForm.value).subscribe(
              () => {
                this.router.navigateByUrl('/games');
                this.toastr.success('Chỉnh sửa thàng công.');
              },
              error => {
                this.check = true;
                this.toastr.error('Chỉnh sửa thất bại thất bại, hãy thử lại.');
              }
            );
          });
        })
      ).subscribe();
    } else {
      this.gameService.updateGame(this.id, this.gameForm.value).subscribe(
        () => {
          this.router.navigateByUrl('/games');
          this.toastr.success('Chỉnh sửa thàng công.');
        },
        error => {
          this.toastr.error('Chỉnh sửa thất bại thất bại, hãy thử lại!.');
        }
      );
    }
  }

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
