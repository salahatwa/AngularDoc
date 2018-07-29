import { Component, OnInit, Input } from '@angular/core';

import { ConfService } from '../../conf.service';
import { GitProxyService } from '../../git-proxy.service';
import { UtilsService } from '../../utils.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {

  @Input() issue: string;
  accessToken: string;
  comments: any[];
  user: any;

  constructor(
    private confService: ConfService,
    private gitProxyService: GitProxyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.gitProxyService
      .getCommentsOfIssue(
        this.confService.config.owner,
        this.confService.config.repo,
        this.issue
      )
      .then(comments => {
        this.comments = comments;
        this.accessToken = sessionStorage.getItem('access_token');
        if (this.accessToken) {
          this.gitProxyService
            .getAuthUserInfo(this.accessToken)
            .then(user => this.user = user);
        }
      });
  }

  headerImageStyle(avatarUrl: string): object {
    return {
      'background-image': "url('" + avatarUrl + "')",
      'background-size': 'cover'
    }
  }

  marked(content: string) {
    return this.utilsService.marked(content);
  }

  isLoged(): boolean {
    if (this.accessToken == null || this.accessToken == "") {
      return false;
    }
    return true;
  }

}
