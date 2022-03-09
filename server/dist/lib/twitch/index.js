"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Router = exports.Client = void 0;
var client_1 = require("./client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return client_1.Client; } });
var router_1 = require("./command/router");
Object.defineProperty(exports, "Router", { enumerable: true, get: function () { return __importDefault(router_1).default; } });
//# sourceMappingURL=index.js.map