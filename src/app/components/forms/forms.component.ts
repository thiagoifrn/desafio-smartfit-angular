import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { GetUnitsService } from '../../services/get-units.service';
import { Location } from '../../types/locations.interface';

const OPENING_HOURS = {
  morning: {
    first: '06',
    last: '12',
  },
  afternoon: {
    first: '12',
    last: '18',
  },
  night: {
    first: '18',
    last: '23',
  },
};

type Hour_index = 'morning' | 'afternoon' | 'night';

@Component({
  selector: 'app-forms',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './forms.component.html',
  styleUrl: './forms.component.scss',
})
export class FormsComponent implements OnInit {
  results: Location[] = [];
  filteredResults: Location[] = [];
  formGroup!: FormGroup;

  constructor(
    private FormBuilder: FormBuilder,
    private unitService: GetUnitsService
  ) {}

  ngOnInit(): void {
    this.formGroup = this.FormBuilder.group({
      hour: '',
      showClosed: true,
    });
    this.unitService.getAllUnits().subscribe((data) => {
      this.results = data.locations;
      this.filteredResults = data.locations;
    });
  }

  transformWeekday(weekday: number) {
    switch (weekday) {
      case 0:
        return 'Dom.';
      case 6:
        return 'Sáb.';
      default:
        return 'Seg. à Sex.';
    }
  }

  filterUnits(unit: Location, open_hour: string, close_hour: string) {
    if (!unit.schedules) return true;
    let open_hour_filter = parseInt(open_hour, 10);
    let close_hour_filter = parseInt(close_hour, 10);

    let todays_weekday = this.transformWeekday(new Date().getDay());

    for (let i = 0; i < unit.schedules.length; i++) {
      let schedule_hours = unit.schedules[i].hour;
      let schedule_weekday = unit.schedules[i].weekdays;

      if (todays_weekday !== schedule_weekday) {
        if (schedule_hours !== 'Fechada') {
          let [unit_open_hour, unit_close_hour] = schedule_hours.split(' às ');
          let unit_open_hour_int = parseInt(
            unit_open_hour.replace('h', ''),
            10
          );
          let unit_close_hour_int = parseInt(
            unit_close_hour.replace('h', ''),
            10
          );
          if (
            unit_open_hour_int <= open_hour_filter &&
            unit_close_hour_int >= close_hour_filter
          )
            return true;
          else return false;
        }
      }
    }

    return false;
  }

  onSubmit(): void {
    let auxResult = this.results;

    if (!this.formGroup.value.showClosed) {
      auxResult = this.results.filter((item) => item.opened === true);
    }
    if (this.formGroup.value.hour) {
      const OPEN_HOUR =
        OPENING_HOURS[this.formGroup.value.hour as Hour_index].first;
      const CLOSE_HOUR =
        OPENING_HOURS[this.formGroup.value.hour as Hour_index].last;
      this.filteredResults = auxResult.filter((location) =>
        this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR)
      );
    } else {
      this.filteredResults = auxResult;
    }
  }
  onClean(): void {
    this.formGroup.reset();
  }
}
