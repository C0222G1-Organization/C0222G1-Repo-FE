import { Component, OnInit } from '@angular/core';
import {Title} from "@angular/platform-browser";

@Component({
  selector: 'app-server-error',
  templateUrl: './server-error.component.html',
  styleUrls: ['./server-error.component.css']
})
export class ServerErrorComponent implements OnInit {

  constructor(private title: Title) {
    this.title.setTitle('500 Server Không Hoạt Động');
  }

  ngOnInit(): void {
  }

}
