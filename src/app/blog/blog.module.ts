import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { ContentNamePipe } from '../content-name.pipe';
import { BlogPanelComponent, AddBlogDialog } from './blog-panel/blog-panel.component';
import { BlogContentComponent } from './blog-content/blog-content.component';
import { WhatIsNewComponent } from './what-is-new/what-is-new.component';
import { FolderComponent, DeleteBlogDialog } from './folder/folder.component';
import { IssueContentComponent, CloseIssueDialog } from './what-is-new/issue-content/issue-content.component';
import { FooterComponent } from './footer/footer.component';
import { BlogService } from './blog.service';
import { IssueEditorComponent } from './issue-editor/issue-editor.component';
import { CommentComponent } from './comment/comment.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    BlogRoutingModule
  ],
  declarations: [
    BlogPanelComponent,
    AddBlogDialog,
    BlogContentComponent,
    WhatIsNewComponent,
    ContentNamePipe,
    FolderComponent,
    DeleteBlogDialog,
    IssueContentComponent,
    CloseIssueDialog,
    FooterComponent,
    IssueEditorComponent,
    CommentComponent
  ],
  providers: [
    BlogService
  ],
  entryComponents: [
    AddBlogDialog,
    DeleteBlogDialog,
    CloseIssueDialog
  ]
})
export class BlogModule { }
