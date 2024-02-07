import { Component, Input, OnInit } from '@angular/core';
import { Location } from '../../types/locations.interface';
import { CardComponent } from '../card/card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cards-list',
  standalone: true,
  templateUrl: './cards-list.component.html',
  styleUrl: './cards-list.component.scss',
  imports: [CardComponent, CommonModule],
})
export class CardsListComponent implements OnInit {
  @Input() unitList: Location[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.unitList);
  }
}
