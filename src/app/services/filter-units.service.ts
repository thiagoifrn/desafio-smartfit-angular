import { Injectable } from '@angular/core';
import { Location } from '../types/locations.interface';

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


@Injectable({
  providedIn: 'root'
})
export class FilterUnitsService {

  constructor() { }

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

  filter(results: Location[], showClosed: boolean, hour: string){
    let auxResult = results;

    if (!showClosed) {
      auxResult = results.filter((item) => item.opened === true);
    }
    if (hour) {
      const OPEN_HOUR =
        OPENING_HOURS[hour as Hour_index].first;
      const CLOSE_HOUR =
        OPENING_HOURS[hour as Hour_index].last;
      return auxResult.filter((location) =>
        this.filterUnits(location, OPEN_HOUR, CLOSE_HOUR)
      );
    } else {
      return auxResult;
    }
  }
}
