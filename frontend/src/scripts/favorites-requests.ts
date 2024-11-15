import {Address} from "./types.ts";

export function isSameFavorite(f1: Address, f2: Address) {
  return f1.city === f2.city && f2.state === f2.state
}

export function addFavorite(address: Address) {
  console.log(JSON.stringify(address));
  return fetch("/api/favorites", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(address)
  })
}

export function deleteFavorite(address: Address) {
  return fetch("/api/favorites", {
    method: "DELETE",
    body: JSON.stringify(address)
  })
}