import * as mcnet from "@minecraft/server-net";

let authKey = "mechacraft-2023";

async function getRequest(url: string): Promise<mcnet.HttpResponse> {
    const req = new mcnet.HttpRequest(url);
    req.method = mcnet.HttpRequestMethod.Get;
    req.headers = [new mcnet.HttpHeader("Content-Type", "application/json"), new mcnet.HttpHeader("auth", authKey)];

    return await mcnet.http.request(req);
}

async function postRequest(url: string, data: any): Promise<mcnet.HttpResponse> {
    const req = new mcnet.HttpRequest(url);
    req.body = JSON.stringify(data);
    req.method = mcnet.HttpRequestMethod.Post;
    req.headers = [new mcnet.HttpHeader("Content-Type", "application/json"), new mcnet.HttpHeader("auth", authKey)];

    return await mcnet.http.request(req);
}

export { getRequest, postRequest };
