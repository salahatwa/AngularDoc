import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormControl, FormControlDirective, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSidenav, MatSnackBar, MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { BlogService } from '../blog.service';
import { AuthService } from '../../auth.service';
import { UtilsService } from '../../utils.service';

@Component({
  selector: 'app-blog-panel',
  templateUrl: './blog-panel.component.html',
  styleUrls: ['./blog-panel.component.scss']
})
export class BlogPanelComponent implements OnInit {
  @ViewChild(MatSidenav) sidenave: MatSidenav;
  dirs: any[];
  markedDir: string;

  constructor(
    private router: Router,
    public dialog: MatDialog,
    public snackBar: MatSnackBar,
    private blogService: BlogService,
    public authService: AuthService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.blogService
      .getDirs()
      .then(dirs => this.dirs = dirs);
  }

  getSideNavMode(): string {
    if (this.utilsService.isMobile()) {
      return "over";
    }
    return "side";
  }

  isMarkedDir(dir: string): boolean {
    return dir == this.markedDir;
  }

  isDefaultOpen(): boolean {
    if (this.utilsService.isMobile()) {
      return false;
    }
    return true;
  }

  close(): void {
    if (this.utilsService.isMobile()) {
      this.sidenave.close();
    }
  }

  openAddBlogDialog(): void {
    let dialogRef = this.dialog.open(AddBlogDialog, {
      minWidth: '25vw',
      minHeight: '30vh',
      data: {
        dir: "",
        file: ""
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.createBlog(result.dir, result.file);
        }
      });
  }

  createBlog(dir: string, file: string): void {
    this.blogService
      .createFile(dir, file)
      .then(
        newFile => this.blogService
        .getDirs()
        .then(dirs => {
          this.markedDir = dir;
          this.dirs = dirs;
          this.router.navigate(['docs', newFile.content.name]);
          this.snackBar.open("Created successfully!", "", {
            duration: 600
          });
        })
        .catch(this.handleError)
      )
      .catch(this.handleError);
  }

  handleError(err: HttpErrorResponse): void {
    this.snackBar.open(this.utilsService.getErrorInfo(err), "", {
      duration: 1000,
    });
  }

  onDeleted(isDeleted: boolean) {
    if (isDeleted) {
      this.blogService
        .getDirs()
        .then(dirs => {
          this.dirs = dirs;
          this.router.navigate(['']);
          this.snackBar.open("successfully deleted!", "", {
            duration: 600
          });
        })
    }
  }
}

@Component({
  selector: 'add-blog-dialog',
  templateUrl: './add-blog-dialog.html',
  styleUrls: ['./add-blog-dialog.scss']
})
export class AddBlogDialog implements OnInit {
  dirs: any[];
  dirCtrl: FormControl;
  fileCtrl: FormControl;
  filteredDirs: Observable<any[]>;

  constructor(
    public dialogRef: MatDialogRef<AddBlogDialog>,
    private blogService: BlogService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dirCtrl = new FormControl('', [
      Validators.required
    ]);
    this.fileCtrl = new FormControl('', [
      Validators.required
    ]);
  }

  ngOnInit() {
    this.blogService
      .getDirs()
      .then(dirs => {
        this.dirs = dirs;
        this.filteredDirs = this.dirCtrl.valueChanges
          .startWith(null)
          .map(dir => dir ? this.filterDirs(dir) : this.dirs.slice());
      });
  }

  filterDirs(name: string) {
    return this.dirs.filter(dir =>
      dir.name.indexOf(name) >= 0);
  }

  onNoClick(): void {
    this.dialogRef.close(this.data);
  }

  hasError(): boolean {
    return this.dirCtrl.hasError('required') || this.dirCtrl.hasError('pattern') || this.fileCtrl.hasError('required') || this.fileCtrl.hasError('pattern')
  }
}
