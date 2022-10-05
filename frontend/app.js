import HttpClient from "./utils/http-client.js";
import View from "./view.js";
import Model from "./model.js"
import Controller from "./controller.js";

const baseUrl = "http://localhost:3000"
const headers = {
    'Content-Type': 'application/json;charset=utf-8'
};

const view = new View();
const model = new Model();
const client = new HttpClient({baseUrl,headers});

const app = new Controller(view, model, client);