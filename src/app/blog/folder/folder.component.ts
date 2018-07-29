import { Component, EventEmitter, OnInit, Input, Output, Inject } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSidenav, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AuthService } from '../../auth.service';
import { BlogService } from '../blog.service';
import { UtilsService } from '../../utils.service';

@Component({
  selector: 'app-folder',
  templateUrl: './folder.component.html',
  styleUrls: ['./folder.component.scss']
})
export class FolderComponent implements OnInit {
  @Input() dir: string;
  @Input() sidenav: MatSidenav;
  @Output() onDeleted = new EventEmitter<boolean>();

  files: any[];
  isShow = true;

  constructor(
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private authService: AuthService,
    private blogService: BlogService,
    private utilsService: UtilsService,
  ) { }

  ngOnInit() {
    this.blogService
      .getFiles(this.dir)
      .then(files => this.files = files);
  }

  close(): void {
    if (this.utilsService.isMobile()) {
      this.sidenav.close();
    }
  }

  openDeleteBlogDialog(path: string, number: string, title: string): void {
    let dialogRef = this.dialog.open(DeleteBlogDialog, {
      minWidth: '25vw',
      minHeight: '30vh',
      data: {
        path: path
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.deleteBlog(number, title);
        }
      });
  }

  deleteBlog(number: string, title: string): void {
    this.blogService
      .deleleFile(number, title)
      .then(deleteResult => this.onDeleted.emit(true));
  }

  handleError(err: HttpErrorResponse): void {
    this.snackBar.open(this.utilsService.getErrorInfo(err), "", {
      duration: 1000,
    });
  }
}

@Component({
  selector: 'delete-blog-dialog',
  templateUrl: './delete-blog-dialog.html',
  styleUrls: ['./delete-blog-dialog.scss']
})
export class DeleteBlogDialog {

  constructor(
    public dialogRef: MatDialogRef<DeleteBlogDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}



