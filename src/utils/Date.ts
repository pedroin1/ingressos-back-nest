export function transformToPrismaDateTime(date: string) {
  return new Date(`${date}`);
}

export function transformFromPrismaDateTime(date: Date) {
  let year = date.getFullYear();
  let month = ('0' + (date.getMonth() + 1)).slice(-2);
  let day = ('0' + date.getDate()).slice(-2);
  let hours = ('0' + date.getHours()).slice(-2);
  let minutes = ('0' + date.getMinutes()).slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
