import http from "./httpService";

export function getGenres(onProgress) {
  return http.get("/genres", { onDownloadProgress: onProgress });
}
