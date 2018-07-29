import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BlogPanelComponent } from './blog-panel/blog-panel.component';
import { WhatIsNewComponent } from './what-is-new/what-is-new.component';
import { BlogContentComponent } from './blog-content/blog-content.component';
import { IssueEditorComponent } from './issue-editor/issue-editor.component';

const routes: Routes = [
  {
    path: '',
    component: BlogPanelComponent,
    children: [
      {
        path: '',
        component: WhatIsNewComponent
      }, {
        path: 'README.md',
        component: BlogContentComponent
      }, {
        path: 'issue',
        component: IssueEditorComponent
      }, {
        path: 'issue/:number',
        component: IssueEditorComponent
      }, {
        path: 'docs/:number',
        component: BlogContentComponent
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BlogRoutingModule { }
