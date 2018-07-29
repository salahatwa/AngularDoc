import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'contentName'
})
export class ContentNamePipe implements PipeTransform {

  transform(name: string, type: string): string {
    switch(type) {
      case 'file':
        return name.substring('00 '.length, name.length - '.md'.length);
      case 'dir':
        return name.substring('00 '.length, name.length);
      default:
        return name;
    }
  }

}
