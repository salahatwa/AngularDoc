import { Component, EventEmitter, OnInit, Input, Output, Inject } from '@angular/core';
import { MatSidenav, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

import { ConfService } from '../../../conf.service';
import { GitProxyService } from '../../../git-proxy.service';
import { AuthService } from '../../../auth.service';
import { UtilsService } from '../../../utils.service';

@Component({
  selector: 'app-issue-content',
  templateUrl: './issue-content.component.html',
  styleUrls: ['./issue-content.component.scss']
})
export class IssueContentComponent implements OnInit {
  @Input() issue: any;
  @Output() onClosed = new EventEmitter<boolean>();
  headerImageStyle = { };
  user: string;
  createAt: string;
  title: string;
  body: string;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private confService: ConfService,
    public authService: AuthService,
    private gitProxyService: GitProxyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.user = this.issue.user.login;
    this.headerImageStyle = {
      'background-image': "url('" + this.issue.user.avatar_url + "')",
      'background-size': 'cover'
    }
    this.createAt = this.issue.created_at;
    this.title = this.issue.title;
    this.utilsService.markdownText(this.utilsService.emojiParser(this.issue.body))
      .then(body => this.body = body);
  }

  openCloseIssueDialog(): void {
    let dialogRef = this.dialog.open(CloseIssueDialog, {
      minWidth: '25vw',
      minHeight: '30vh',
      data: {
        title: this.issue.title
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.closeIssue();
        }
      });
  }

  closeIssue(): void {
    this.gitProxyService
    .updateIssue(
      this.confService.config.owner,
      this.confService.config.repo,
      this.issue.number,
      this.issue.title,
      sessionStorage.getItem('access_token'),
      'closed'
    )
    .then(() => this.onClosed.emit(true));
  }
}

@Component({
  selector: 'close-issue-dialog',
  templateUrl: './close-issue-dialog.html',
  styleUrls: ['./close-issue-dialog.scss']
})
export class CloseIssueDialog {

  constructor(
    public dialogRef: MatDialogRef<CloseIssueDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
