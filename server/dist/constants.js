"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__verbose__ = exports.__debug__ = exports.__prod__ = void 0;
exports.__prod__ = process.env.NODE_ENV === "production";
exports.__debug__ = process.env.DEBUG === "true";
exports.__verbose__ = process.env.VERBOSE === "true";
//# sourceMappingURL=constants.js.map