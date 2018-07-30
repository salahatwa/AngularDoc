import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/materialize';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import { AuthService } from '../../auth.service';
import { BlogService } from '../blog.service';
import { UtilsService } from '../../utils.service';

@Component({
  selector: 'app-blog-content',
  templateUrl: './blog-content.component.html',
  styleUrls: ['./blog-content.component.scss']
})
export class BlogContentComponent implements OnInit {
  number: string;
  title: string;
  codeBackup: string;
  code: string;
  file: Observable<string>;
  isOnLoading = true;
  isChanged: boolean;
  private markTerms = new Subject<string>();

  constructor(
    public snackBar: MatSnackBar,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    public authService: AuthService,
    private blogService: BlogService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.file = this.markTerms
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(code => this.utilsService.markdownText(this.utilsService.emojiParser(code)));

    this.activatedRoute.params
      .switchMap((params: ParamMap) => {
        this.isOnLoading = true;
        this.number = params['number'];
        return this.blogService
          .getFile(params['number']).materialize();
      })
      .subscribe(notification => {
        if (notification.hasValue) {
          this.code = notification.value.body;
          this.title = notification.value.title;
          this.codeBackup = this.code;
          this.mark(this.code);
          this.isOnLoading = false;
        } else if (notification.error) {
          this.code = "Loading error!";
          this.codeBackup = this.code;
          this.mark(this.code);
          this.isOnLoading = false;
        }
      });
  }

  mark(code: string): void {
    this.markTerms.next(code);
    this.checkFileChangs();
  }

  updateFileContent(): void {
    this.blogService
      .updateFile(
        this.number,
        this.title,
        this.code,
        this.location.path()
      )
      .then(() => {
        this.codeBackup = this.code;
        this.checkFileChangs();
        this.snackBar.open("保存成功！", "", {
          duration: 600,
        });
      })
      .catch(this.handleError);
  }

  handleError(err: HttpErrorResponse): void {
    this.snackBar.open(this.utilsService.getErrorInfo(err), "", {
      duration: 1000,
    });
  }

  checkFileChangs(): void {
    this.isChanged = this.code != this.codeBackup;
  }

  test(): void {
    document.getElementsByClassName('markdown-section')[0].innerHTML = document.getElementsByClassName('markdown-section')[0].innerHTML.replace(/<p>##&nbsp;\S*<\/p>/g, '<h2></h2>');
  }
}
