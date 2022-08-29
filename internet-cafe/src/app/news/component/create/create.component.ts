import { Component, OnInit } from '@angular/core';
import {NewsService} from '../../service/news.service';
import {GameCategory} from '../../model/game-category';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Title} from '@angular/platform-browser';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  checkImgSize = false;
  checkImg: boolean;
  regexImg = false;
  public Editor = ClassicEditor;
  checkmodal = false;

  constructor(private newsService: NewsService,
              private storage: AngularFireStorage,
              private router: Router,
              private toastr: ToastrService,
              private title: Title) {
    this.title.setTitle('Thêm tin tức');
  }
  selectedFile: File = null;
  gameCateList: GameCategory[];
  formNews = new FormGroup({
    title: new FormControl('', [Validators.required,
      Validators.minLength(20), Validators.maxLength(150)]),
    imageUrl: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required, Validators.minLength(200)]),
    createDate: new FormControl(this.getCurrentDateTime()),
    views: new FormControl(0),
    author: new FormControl('', [Validators.required,
      Validators.pattern('^[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]' +
        '[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*(?:[ ]' +
        '[A-ZÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]' +
        '[a-zàáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]*)*$'),
      Validators.minLength(2), Validators.maxLength(50)]),
    gameCategory: new FormControl('', [Validators.required])
  });

  url: any;
  msg = '';

  ngOnInit(): void {
    this.newsService.getAllGameCate().subscribe(
      value => this.gameCateList = value
    );
  }

  onFileSelected(event) {
    if (event.target.files[0].size > 9000000) {
      this.checkImgSize = true;
      return;
    }
    if (!event.target.files[0].name.match('^.*\\.(jpg|JPG|png|PNG)$')) {
      this.regexImg = true;
      return;
    }
    this.selectedFile = event.target.files[0];
    this.formNews.patchValue({imageUrl: this.selectedFile.name});
    this.selectFile();
  }

  create() {
    this.checkmodal = true;
    if (this.formNews.invalid) {
      this.toastr.error('Nhập đầy đủ thông tin.');
      this.checkmodal = false;
      return;
    }
    const nameImg = this.getCurrentDateTime() + this.selectedFile.name;
    const filePath = `news/${nameImg}`;
    const fileRef = this.storage.ref(filePath);
    this.storage.upload(`news/${nameImg}`, this.selectedFile).snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe((url) => {
          this.formNews.patchValue({imageUrl: url});
          console.log(url);
          console.log(this.formNews.value);
          this.newsService.createNews(this.formNews.value).subscribe(
            () => {
              this.router.navigateByUrl('news');
              this.toastr.success('Đăng bài thàng công.');
            },
            error => {
              this.toastr.error('Đăng bài thất bại, hãy thử lại.');
              this.checkmodal = false;
            }
          );
        });
      })
    ).subscribe();
  }


  getCurrentDateTime(): string {
    return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
  }

  selectFile() {
    if (!this.selectedFile || this.selectedFile.name === '') {
      return;
    }
    this.checkImgSize = false;
    this.checkImg = false;
    this.regexImg = false;

    const mimeType = this.selectedFile.type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = 'Only images are supported';
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(this.selectedFile);

    // tslint:disable-next-line:variable-name
    reader.onload = (_event) => {
      this.msg = '';
      this.url = reader.result;
    };
  }

  setRequiredImg() {
    setTimeout(() => {
      this.checkImg = true;
    }, 1000);
  }
}
