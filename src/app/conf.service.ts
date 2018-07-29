import { Injectable, OnInit } from '@angular/core';

import { GitProxyService } from './git-proxy.service';
import { Config } from './config';

export const branch = 'yk-doc-pages';

@Injectable()
export class ConfService {
  config = new Config();

  constructor(
    private gitProxyService: GitProxyService
  ) { }

  initConfig(): void {
    this.config.owner = window.location.host.substring(0, window.location.host.indexOf('.gitee.io'));
    // this.config.owner = 'yorkecao';
    if (window.location.pathname == '/') {
      this.config.repo = this.config.owner;
    } else {
      this.config.repo = window.location.pathname.substring(1, window.location.pathname.length);
      if(this.config.repo.endsWith('/')) {
        this.config.repo = this.config.repo.substring(0, this.config.repo.length - 1);
      }
    }
    this.config.branch = branch;
    this.gitProxyService
      .getRepo(
        this.config.owner,
        this.config.repo
      )
      .then(repo => this.config.admin = repo.owner.login);
  }
}
