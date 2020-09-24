import { request } from "./request.js";
export function fetch_global() {
  return request({
    url: "/global",
  });
}
export function fetch_countries() {
  return request({
    url: "/countries",
  });
}
export function fetch_countries_latest() {
  return request({
    url: "/countries",
  });
}
export function fetch_country(params) {
  return request({
    url: "/countries",
    params,
  });
}
