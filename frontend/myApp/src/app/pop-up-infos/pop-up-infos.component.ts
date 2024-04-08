import { Component, Inject } from '@angular/core';
import { IDimension } from '../IDimension';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pop-up-infos',
  templateUrl: './pop-up-infos.component.html',
  styleUrl: './pop-up-infos.component.css',
})
export class PopUpInfosComponent {
  name: string = '';
  date: string = '';
  size: number = 0;
  dimensions: IDimension = { width: 0, height: 0 };

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.name = data.name;
    this.date = data.date;
    this.size = data.size;
    this.dimensions = data.dimensions;
  }
}
