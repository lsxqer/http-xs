export function validateFetchStatus(status, succ, error) {
    return (status >= 200 || status <= 400) ? succ : error;
}
