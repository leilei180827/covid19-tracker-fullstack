import { request } from "./request.js";
export function fetch_au_latest() {
  return request({
    url: "/australia",
  });
}
export function fetch_au_states() {
  return request({
    url: "/australia/states",
  });
}
// export function fetch_countries() {
//   return request({
//     url: "/countries",
//   });
// }
// export function fetch_countries_latest() {
//   return request({
//     url: "/countries",
//   });
// }
// export function fetch_country(params) {
//   return request({
//     url: "/countries",
//     params,
//   });
// }
