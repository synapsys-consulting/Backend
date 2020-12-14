"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuth = void 0;
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const moment_1 = __importDefault(require("moment"));
const secret = '895.ClAvE_PlAtAfOrMa_COMPRAS?3295_SeCrEtA?5874';
function ensureAuth(req, res, next) {
    let payload;
    if (!req.headers.authorization) {
        res.status(403).send({ message: 'La peticion no tiene la cabecera de autenticación' });
    }
    else {
        try {
            const token = req.headers.authorization.replace(/['"]+/g, '');
            payload = jwt_simple_1.default.decode(token, secret);
            if (payload.exp <= moment_1.default().unix()) {
                res.status(401).send({ message: 'El token ha expirado' });
            }
            req.user = payload;
            next();
        }
        catch (ex) {
            //console.log(ex);
            res.status(404).send({ message: 'Token no valido' });
        }
    }
}
exports.ensureAuth = ensureAuth;
