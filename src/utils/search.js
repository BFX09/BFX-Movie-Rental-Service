import { findBestMatch } from "string-similarity";

export function search(items, searchQuery) {
  const filtered = items.filter((m) => {
    let titles = [];
    let result = [];
    items.forEach((item) => titles.push(item.title.toLowerCase()));
    const best = findBestMatch(searchQuery.toLowerCase(), titles).ratings;
    best.forEach((element) => {
      if (element.rating > 0.55) result.push(element.target);
    });
    if (result.length === 0)
      return m.title.toLowerCase().startsWith(searchQuery.toLowerCase());
    return result.includes(m.title.toLowerCase());
  });

  return filtered;

}
