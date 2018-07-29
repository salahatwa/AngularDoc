import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { DataSource } from '@angular/cdk/collections';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/merge';

import { ConfService } from '../conf.service';
import { GitProxyService } from '../git-proxy.service';
import { UtilsService } from '../utils.service';

const version = 'v4.0.0';

@Component({
  selector: 'app-initializr',
  templateUrl: './initializr.component.html',
  styleUrls: ['./initializr.component.scss']
})
export class InitializrComponent implements OnInit {
  message = '';
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  progress = 0;
  owner: string;
  repo: string;
  branch: string;
  accessToken: string;
  link: string;
  displayedColumns = ['path', 'size', 'state'];
  blobDatabase: BlobDatabase;
  dataSource: BlobDataSource;

  constructor(
    private _formBuilder: FormBuilder,
    private confService: ConfService,
    private gitProxyService: GitProxyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.branch = this.confService.config.branch;
    this.accessToken = sessionStorage.getItem('access_token');
    this.gitProxyService
      .getAuthUserInfo(this.accessToken)
      .then(user => this.owner = user.login);
  }

  hasError(): boolean {
    return this.blobDatabase
      ? !this.blobDatabase.isEmpty()
      : false;
  }

  installYkDoc(): void {
    this.link = '';
    this.progress = 0;
    this.gitProxyService
      .getBranches(this.owner, this.repo, this.accessToken)
      .then(branches => {
        for (let branch of branches) {
          if (branch.name == 'yk-doc-pages') { // 拥有合法分支
            this.gitProxyService
              .getTags(
                this.confService.config.owner,
                this.confService.config.repo
              )
              .then(tags => {
                for (let tag of tags) {
                  if (tag.name == version) { // 找到版本
                    this.gitProxyService.getTree(
                      this.confService.config.owner,
                      this.confService.config.repo,
                      tag.commit.sha,
                      1,
                      this.accessToken
                    )
                    .then(tree => {
                      let newTree = (tree.tree as any[]).filter(this.treeFilter);
                      this.blobDatabase = new BlobDatabase();
                      this.dataSource = new BlobDataSource(this.blobDatabase);
                      let finishBlob = 0;
                      for (let i = 0; i < newTree.length; i++) {
                        let node = newTree[i];
                        this.message = '正在部署...';
                        this.gitProxyService
                          .getBlob(
                            this.confService.config.owner,
                            this.confService.config.repo,
                            node.sha
                          )
                          .then(blob => {
                            this.message = '开始部署：' + node.path;
                            this.gitProxyService
                            .createFile(
                              this.owner,
                              this.repo,
                              '/' +node.path,
                              this.buildContent(node.path, blob.content),
                              ':tada: initialized by yk-doc-initializr',
                              this.accessToken,
                              'yk-doc-pages'
                            ).then(
                              () => {
                                this.message = '已部署：' + node.path;
                                finishBlob++;
                                this.progress = 100 * (finishBlob / newTree.length);
                                if (this.progress == 100) {
                                  this.message = '初始化完成';
                                  this.link = this.getLink();
                                }
                              }
                            ).catch(error => {
                              finishBlob++;
                              this.progress = 100 * (finishBlob / newTree.length);
                              if (this.progress == 100) {
                                this.message = '初始化完成';
                                this.link = this.getLink();
                              }
                              if (error.status == 404) {
                                this.blobDatabase.addBlob({
                                  path: node.path,
                                  size: node.size,
                                  state: '文件已存在！'
                                });
                              }
                            });
                          }
                        );
                      }
                    })

                  }
                }
              });
              break;
          }
        }
      });
  }

  treeFilter(node: any) {
    return node.type == 'blob' && !(node.path as string).startsWith('docs/');
  }

  getLink() {
    return this.owner == this.repo
      ? 'https://' + this.owner + '.gitee.io'
      : 'https://' + this.owner + '.gitee.io/' + this.repo
  }

  buildContent(path: string, content:string): string {
    if (this.owner != this.repo) {
      if (path == 'index.html') {
        content = this.utilsService
          .b64DecodeUnicode(content)
          .replace('<base href="/">', '<base href="https://' + this.owner + '.gitee.io/' + this.repo + '/"');
        return this.utilsService.b64EncodeUnicode(content);
      } else {
        return content.replace(/\n/g, '');
      }
    } else {
      return content.replace(/\n/g, '');
    }
  }
}

export interface BlobData {
  path: string;
  size: number;
  state: string;
}

export class BlobDatabase {
  dataChange: BehaviorSubject<BlobData[]> = new BehaviorSubject<BlobData[]>([]);
  get data(): BlobData[] { return this.dataChange.value; }

  addBlob(blob: BlobData) {
    const copiedData = this.data.slice();
    copiedData.push(blob);
    this.dataChange.next(copiedData);
  }

  isEmpty(): boolean {
    return this.data.slice().length <= 0;
  }
}

export class BlobDataSource extends DataSource<any> {
  constructor(private _blobDatabase: BlobDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<BlobData[]> {
    const displayDataChanges = [
      this._blobDatabase.dataChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      return this._blobDatabase.data.slice();
    });
  }

  disconnect() {}
}
