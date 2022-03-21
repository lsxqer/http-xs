

export function checkFetchStatus(
  status: number,
  succ: any,
  error: any
) {
  return (status >= 200 || status <= 400) ? succ : error;
}