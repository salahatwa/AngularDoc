import { Component, OnInit, Input } from '@angular/core';

import { UtilsService } from '../../utils.service';

@Component({
  selector: 'app-commit-content',
  templateUrl: './commit-content.component.html',
  styleUrls: ['./commit-content.component.scss']
})
export class CommitContentComponent implements OnInit {
  @Input() commit: any;
  name: string;
  date: string;
  message: string;
  headerImageStyle = { };

  constructor(
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.name = this.commit.commit.commiter.name;
    this.date = this.commit.commit.commiter.date;
    this.utilsService.markdownText(this.utilsService.emojiParser(this.commit.commit.message))
      .then(mdContent => this.message = mdContent);
    this.headerImageStyle = {
      'background-image': "url('" + this.commit.author.avatar_url + "')",
      'background-size': 'cover'
    }
  }
}
