export class XsError extends Error {
    constructor(status, message, timeout, req, headers, type) {
        super(message);
        this.response = null;
        this.timeout = null;
        this.ok = false;
        this.status = status;
        this.message = message;
        this.timeout = timeout;
        this.requestConfig = req;
        this.headers = headers;
        this.type = type;
    }
}
export function createResolve(resolve, requestConf, response, header, status, message, type = "default") {
    let successStruct = {
        response: response,
        headers: header,
        status: status,
        ok: status === 200,
        timeout: Number.isInteger(requestConf.timeout) ? requestConf.timeout : null,
        message: message,
        type: type,
        completeConfig: requestConf
    };
    /*
      refetch
      
    */
    return resolve(successStruct);
}
