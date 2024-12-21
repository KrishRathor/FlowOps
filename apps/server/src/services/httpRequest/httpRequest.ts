import axios, { type AxiosPromise } from "axios";

interface IConfig {
    baseURL: string,
    headers?: Record<string, string>,
    timeOut?: number,
    params?: Record<string, string | number>,
    withCredentials?: boolean,
    body: Record<string, string>
}

class HttpRequest {

    private config: IConfig;

    constructor(config: IConfig) {
        this.config = config
    }

    async makeRequest(): Promise<AxiosPromise> {
        const response = await axios.post(this.config.baseURL, this.config.body, {
            headers: this.config.headers,
            withCredentials: this.config.withCredentials,
            params: this.config.params,
        })
        return response.data;
    }
}

export default HttpRequest;