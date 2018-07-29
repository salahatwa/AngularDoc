import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator, MatPaginatorIntl, PageEvent, MatSnackBar } from '@angular/material';

import { Observable } from 'rxjs/Observable';

import { ConfService } from '../../conf.service';
import { GitProxyService } from '../../git-proxy.service';

@Component({
  selector: 'app-what-is-new',
  templateUrl: './what-is-new.component.html',
  styleUrls: ['./what-is-new.component.scss']
})
export class WhatIsNewComponent implements OnInit, AfterViewInit {
  repo: any;
  issues: Observable<any[]>;
  length;
  pageSize = 7;
  pageSizeOptions = [7];

  pageEvent: PageEvent;

  constructor(
    private matPaginatorIntl: MatPaginatorIntl,
    public snackBar: MatSnackBar,
    private confService: ConfService,
    private gitProxyService: GitProxyService
  ) { }

  ngOnInit() {
    this.matPaginatorIntl.itemsPerPageLabel = "每页条数：";
    this.matPaginatorIntl.nextPageLabel = "";
    this.matPaginatorIntl.previousPageLabel = "";
    this.matPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => { if (length == 0 || pageSize == 0) { return `0 of ${length}`; } length = Math.max(length, 0); const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize; return `${startIndex + 1} - ${endIndex} / ${length}`; }
    this.gitProxyService
      .getRepo(
        this.confService.config.owner,
        this.confService.config.repo
      )
     .then(repo => this.length = repo.open_issues_count);

    this.issues = this.matPaginatorIntl.changes
      .switchMap(
        () => this.gitProxyService.simpleGetIssues(
          this.confService.config.owner,
          this.confService.config.repo,
          'news',
          this.pageEvent
            ? this.pageEvent.pageIndex + 1
            : 1,
          this.pageSize)
        );
  }

  ngAfterViewInit() {
    this.search();
  }

  search(): void {
    this.matPaginatorIntl.changes.next();
  }

  onClosed(isClosed: boolean) {
    this.search();
    this.snackBar.open("删除成功！", "", {
      duration: 600
    });
  }
}
