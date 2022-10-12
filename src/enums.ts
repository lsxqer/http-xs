

/**
 * 返回时的状态
 */

const pw = Math.pow(2, 31) - 10000;

/**
 * 请求处理的状态码
 */
export enum HttpStatusException {
  Cancel = pw >> 2,
  Timeout = pw >> 3,
  Error = pw >> 4,
  Success = 200,
}