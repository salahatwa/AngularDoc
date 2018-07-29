import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfService } from '../conf.service';
import { GitProxyService } from '../git-proxy.service';
import { UtilsService } from '../utils.service';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.scss']
})
export class AboutMeComponent implements OnInit {
  content: string;
  isOnLoading = true;

  constructor(
    private confService: ConfService,
    private gitProxyService: GitProxyService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<AboutMeComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit() {
    this.gitProxyService
      .getReadme(
        this.confService.config.owner,
        this.confService.config.repo,
        this.confService.config.branch
      )
      .then(readme => {
        this.isOnLoading = true;
        this.utilsService.markdownText(this.utilsService.emojiParser(this.utilsService.b64DecodeUnicode(readme.content)))
          .then(mdText => {
            this.content = mdText;
            this.isOnLoading = false;
        });
      });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
