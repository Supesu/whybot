"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const fetchUniques = async () => {
    var e_1, _a;
    const uniques = [];
    const uniquesToLoad = (0, fs_1.readdirSync)(__dirname + "/base").filter((unique) => unique.endsWith(".unique.js"));
    try {
        for (var uniquesToLoad_1 = __asyncValues(uniquesToLoad), uniquesToLoad_1_1; uniquesToLoad_1_1 = await uniquesToLoad_1.next(), !uniquesToLoad_1_1.done;) {
            const u = uniquesToLoad_1_1.value;
            Promise.resolve().then(() => __importStar(require(`${__dirname}/base/${u}`))).then((unique) => {
                if (unique && unique.default) {
                    uniques.push(unique.default);
                }
            });
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (uniquesToLoad_1_1 && !uniquesToLoad_1_1.done && (_a = uniquesToLoad_1.return)) await _a.call(uniquesToLoad_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return uniques;
};
exports.default = fetchUniques;
//# sourceMappingURL=index.js.map