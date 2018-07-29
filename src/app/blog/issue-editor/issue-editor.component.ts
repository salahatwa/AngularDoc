import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';

import { ConfService } from '../../conf.service';
import { GitProxyService } from '../../git-proxy.service';

@Component({
  selector: 'app-issue-editor',
  templateUrl: './issue-editor.component.html',
  styleUrls: ['./issue-editor.component.scss']
})
export class IssueEditorComponent implements OnInit {
  accessToken: string;
  title = '新增动态';
  isNew = true;
  issue = {
    number: '',
    title: '',
    body: ''
  }

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    public snackBar: MatSnackBar,
    private confService: ConfService,
    private gitProxyService: GitProxyService
  ) { }

  ngOnInit() {
    this.route.params
      .subscribe((params: ParamMap) => {
        if (params['number']) {
          this.title = '编辑动态';
          this.gitProxyService
            .getIssue(
              this.confService.config.owner,
              this.confService.config.repo,
              params['number'],
              sessionStorage.getItem('access_token')
            )
            .toPromise()
            .then(issue => {
              this.issue.number = issue.number;
              this.issue.title = issue.title;
              this.issue.body = issue.body;
              this.isNew = false;
            });
        }
      });
    this.accessToken = sessionStorage.getItem('access_token');
  }

  saveIssue() {
    if (this.isNew) {
      this.gitProxyService
        .createIssue(
          this.confService.config.owner,
          this.confService.config.repo,
          this.issue.title,
          this.issue.body,
          2,
          [],
          this.accessToken
        )
        .then(() => {
          this.snackBar.open("创建成功！", "", {
            duration: 600
          });
          this.location.back();
        });
    } else {
      this.gitProxyService
        .updateIssue(
          this.confService.config.owner,
          this.confService.config.repo,
          this.issue.number,
          this.issue.title,
          this.accessToken,
          'open',
          this.issue.body
        )
        .then(() => {
          this.snackBar.open("更新成功！", "", {
            duration: 600
          });
          this.location.back();
        });
    }
  }
}
