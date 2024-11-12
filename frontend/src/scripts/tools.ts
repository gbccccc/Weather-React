import {monthNames, weekdayNames} from "./mappings";

export function formatDate(date: Date) {
  return `${weekdayNames[date.getDay()]}, ${monthNames[date.getMonth()]}. ${date.getDate()}, ${date.getFullYear()}`
}

export function formatTime(date) {
  let hour = date.getHours()
  let ampm = hour >= 12 ? "PM" : "AM"
  hour %= 12
  hour = hour === 0 ? 12 : hour
  return `${hour}:${date.getMinutes()}${ampm}`
}