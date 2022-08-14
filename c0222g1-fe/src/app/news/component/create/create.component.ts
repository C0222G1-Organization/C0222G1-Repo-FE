import { Component, OnInit } from '@angular/core';
import {NewsService} from '../../service/news.service';
import {GameCategory} from '../../model/game-category';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {formatDate} from '@angular/common';
import {AngularFireStorage} from '@angular/fire/storage';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  constructor(private newsService: NewsService,
              private storage: AngularFireStorage,
              private router: Router) {}
  selectedFile: File = null;
  gameCateList: GameCategory[];
  formNews = new FormGroup({
    // tslint:disable-next-line:max-line-length
    title: new FormControl('', [Validators.required, Validators.minLength(20) , Validators.maxLength(150) , Validators.pattern('^[A-Za-z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ-:., ]+$')]),
    imageUrl: new FormControl('', [Validators.required]),
    content: new FormControl('', [Validators.required]),
    createDate: new FormControl(),
    views: new FormControl(),
    // tslint:disable-next-line:max-line-length
    author: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚÝàáâãèéêìíòóôõùúýĂăĐđĨĩŨũƠơƯưẠ-ỹ ]+$') , Validators.maxLength(50)]),
    // gameCategory: new FormControl('', [Validators.required]),
    gameCategory: new FormGroup(
      {id: new FormControl('', [Validators.required])}
    )
  });

  url: any;
  msg = '';

  ngOnInit(): void {
    this.newsService.getAllGameCate().subscribe(
      value => this.gameCateList = value
    );
  }

  onFileSelected(event) {
    this.selectedFile = event.target.files[0];
  }

  create() {
    this.formNews.patchValue({createDate: this.getCurrentDateTime()});
    this.formNews.patchValue({views: 0});
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
            }
          );
        });
      })
    ).subscribe(); }

  getCurrentDateTime(): string {
    return formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss', 'en-US');
  }

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
}
