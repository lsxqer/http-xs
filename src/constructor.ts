import { BaseConfig, HttpMethod, Method, TransformationRequest, TransformationResponse } from "./types";
import { composeConfig, createHttpMethod } from "./core";
import { mutationMethod, queryGetMethod } from "./httpMethod";
import { createXsHeader } from "./xsHeader";

class HttpXs {

  private readonly baseConfig: BaseConfig;

  get: HttpMethod;
  post: HttpMethod;
  delete: HttpMethod;
  head: HttpMethod;
  put: HttpMethod;
  patch: HttpMethod;
  options: HttpMethod;

  constructor(baseConfig?: BaseConfig) {

    this.baseConfig = baseConfig ?? {};
    this. baseConfig.headers = createXsHeader(this.baseConfig.headers);

    const composeBaseConfig = composeConfig.bind(null, this.baseConfig);

    const setTargetMethod = (methodName: Method) => {
      this[methodName] = createHttpMethod(methodName, composeBaseConfig);
    };

    mutationMethod.forEach(methodName => setTargetMethod(methodName));
    queryGetMethod.forEach(methodName => setTargetMethod(methodName));
  }

  useBefore(transformRequest: TransformationRequest[]): ThisType<this> {
    if (!(transformRequest instanceof Array)) {
      console.error(`${transformRequest}is not Array`);
      return;
    }
    let req = this.baseConfig.transformationRequest;
    if (!req) {
      this.baseConfig.transformationRequest = req = [];
    }
    req.push(...transformRequest);
    return this;
  }

  // 后置
  useAfter(transformResponse: TransformationResponse[]): ThisType<this> {
    if (!(transformResponse instanceof Array)) {
      console.error(`${transformResponse}is not Array`);
      return;
    }
    let res = this.baseConfig.transformationResponse;
    if (!res) {
      this.baseConfig.transformationResponse = res = [];
    }
    res.push(...transformResponse);
    return this;
  }
}


export default HttpXs;