import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { FormsComponent } from './components/forms/forms.component';
import { CardComponent } from './components/card/card.component';
import { BehaviorSubject } from 'rxjs';
import { CardsListComponent } from './components/cards-list/cards-list.component';
import { Location } from './types/locations.interface';
import { GetUnitsService } from './services/get-units.service';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FormsComponent,
    CardComponent,
    CardsListComponent,
  ],
})
export class AppComponent {
  showList = new BehaviorSubject(false);
  unitList: Location[] = [];

  constructor(private unitService: GetUnitsService) {}
  onSubimit() {
    this.unitList = this.unitService.getFilteredunits();
    this.showList.next(true);
  }
}
