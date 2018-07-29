import { Injectable } from '@angular/core';

import { ConfService } from '../conf.service';
import { GitProxyService } from '../git-proxy.service';
import { UtilsService } from '../utils.service';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BlogService {

  constructor(
    private confService: ConfService,
    private gitProxyService: GitProxyService,
    private utilsService: UtilsService
  ) { }

  getDirs(): Promise<any[]> {
    return this.gitProxyService
      .getLabels(
        this.confService.config.owner,
        this.confService.config.repo);
  }

  getFiles(dir: string): Promise<any[]> {
    return this.gitProxyService
      .simpleGetIssues(
        this.confService.config.owner,
        this.confService.config.repo,
        'documents',
        1,
        100,
        'open',
        'created',
        'asc',
        dir
      );
  }

  getFile(number: string): Observable<any> {
    return this.gitProxyService
      .getIssue(
        this.confService.config.owner,
        this.confService.config.repo,
        number
      )
  }

  getFileContent(path: string): Observable<any> {
    return this.gitProxyService
      .getFileContent(
        this.confService.config.owner,
        this.confService.config.repo,
        path,
        this.confService.config.branch);
  }

  // 创建文档
  createFile(dir: string, file: string, labels?: string[]): Promise<any> {
    return this.gitProxyService
      .createIssue(
        this.confService.config.owner,
        this.confService.config.repo,
        file,
        '# ' + file,
        1,
        [dir],
        sessionStorage.getItem('access_token')
      ).then(issue =>
        this.gitProxyService
          .createFile(
            this.confService.config.owner,
            this.confService.config.repo,
            '/' + 'docs/' + issue.number,
            this.utilsService.b64EncodeUnicode('# ' + file),
            ':memo: 创建了《' + file + '》',
            sessionStorage.getItem('access_token'),
            this.confService.config.branch
          )
      );
  }

  // 删除文档
  deleleFile(number: string, title: string): Promise<any> {
    return this.gitProxyService
      .updateIssue(
        this.confService.config.owner,
        this.confService.config.repo,
        number,
        title,
        sessionStorage.getItem('access_token'),
        'closed'
      )
  }

  // 更改文档
  updateFileContent(fileContents: any, title: string, content: string): Promise<any> {
    return this.gitProxyService
      .updateFile(
        this.confService.config.owner,
        this.confService.config.repo,
        '/' + fileContents.path,
        this.utilsService.b64EncodeUnicode(content),
        fileContents.sha,
        ':memo: 更新了《' + title + '》',
        sessionStorage.getItem('access_token'),
        this.confService.config.branch
      );
  }

  updateFile(number: string, title: string, body: string, path: string): Promise<any> {
    return this.gitProxyService
      .updateIssue(
        this.confService.config.owner,
        this.confService.config.repo,
        number,
        title,
        sessionStorage.getItem('access_token'),
        'open',
        body
      ).then(updateIssueResult =>
        this.getFileContent(path)
          .subscribe(fileContent =>
            this.updateFileContent(fileContent, title, body)
          )
      );
  }
}
