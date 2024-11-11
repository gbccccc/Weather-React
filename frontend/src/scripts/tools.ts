import {monthNames, weekdayNames} from "./mappings";

export function formatDate(date: Date) {
  return `${weekdayNames[date.getDay()]}, ${monthNames[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}`
}