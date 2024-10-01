import _ from "lodash";

export function paginate(items, pageNumber, pageSize) {
  const startIndex = (pageNumber - 1) * 1;
  return _(items).slice(startIndex).take(pageSize).value();
}
