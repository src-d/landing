const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;
const MONTH = 30 * DAY;
const YEAR = 365 * DAY;

export const TIME_UNITS = {
  second: SECOND,
  minute: MINUTE,
  hour: HOUR,
  day: DAY,
  week: WEEK,
  month: MONTH,
  year: YEAR,
};

export function ago(strTime) {
  const elapsed = Date.now() - Date.parse(strTime);
  let unit;
  if (elapsed > TIME_UNITS['year']) {
    unit = 'year';
  } else if (elapsed > TIME_UNITS['month']) {
    unit = 'month';
  } else if (elapsed > TIME_UNITS['day']) {
    unit = 'day';
  } else if (elapsed > TIME_UNITS['hour']) {
    unit = 'hour';
  } else if (elapsed > TIME_UNITS['minute']) {
    unit = 'minute';
  } else if (elapsed > TIME_UNITS['second']) {
    unit = 'second';
  }

  return plural(Math.floor(elapsed / TIME_UNITS[unit]), unit);
}

export function isNewer(strTime, interval) {
  return Date.now() - Date.parse(strTime) < interval;
}

function plural(number, word) {
  return number + ' ' + (number == 1 ? word : word + 's');
}
