import { Component, OnInit } from '@angular/core';

import { ConfService } from '../conf.service';
import { GitProxyService } from '../git-proxy.service';

@Component({
  selector: 'app-update-logs',
  templateUrl: './update-logs.component.html',
  styleUrls: ['./update-logs.component.scss']
})
export class UpdateLogsComponent implements OnInit {
  commits: any[];
  isOnLoading = true;

  constructor(
    private confService: ConfService,
    private gitProxyService: GitProxyService
  ) { }

  ngOnInit() {
    this.gitProxyService
      .simpleGetCommits(
        this.confService.config.owner,
        this.confService.config.repo,
        this.confService.config.branch
      )
      .then(commits => {
        this.commits = commits;
        this.isOnLoading = false;
      });
  }
}
