class HttpClient {
    constructor(options = {}) {
        this.baseUrl = options.baseUrl || "";
        this.headers = options.headers || {};
    }

    async fetchJSON(endpoint, options = {}) {
        const res = await fetch(this.baseUrl + endpoint, {
            ...options,
            headers: this.headers
        });

        if (!res.ok) throw new Error(res.statusText);

        if (options.parseResponse !== false && res.status !== 204)
            return res.json();

        return undefined;
    }

    setHeader(key, value) {
        this.headers[key] = value;
        return this;
    }

    getHeader(key) {
        return this.headers[key];
    }

    get(endpoint, options = {}) {
        return this.fetchJSON(endpoint, {
            ...options,
            method: "GET"
        });
    }

    post(endpoint, body, options = {}) {
        return this.fetchJSON(endpoint, {
            body: body ? JSON.stringify(body) : undefined,
            method: "POST"
        });
    }

    put(endpoint, body, options = {}) {
        return this.fetchJSON(endpoint, {
            body: body ? JSON.stringify(body) : undefined,
            ...options,
            method: "PUT"
        });
    }

    delete(endpoint, options = {}) {
        return this.fetchJSON(endpoint, {
            parseResponse: false,
            ...options,
            method: "DELETE"
        });
    }

}

export default HttpClient;