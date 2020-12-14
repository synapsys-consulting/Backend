"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToken = void 0;
const jwt_simple_1 = __importDefault(require("jwt-simple"));
const moment_1 = __importDefault(require("moment"));
const secret = '895.ClAvE_PlAtAfOrMa_COMPRAS?3295_SeCrEtA?5874';
function createToken(user) {
    const payload = {
        user_id: user.user_id,
        user_name: user.user_name,
        user_lastname: user.user_lastname,
        user_firstname: user.user_firstname,
        phone_number: user.phone_number,
        email: user.email,
        zip_code: user.zip_code,
        user_nickname: user.user_nickname,
        status_id: user.status_id,
        eff_date: user.eff_date,
        exp_date: user.exp_date,
        user_create_id: user.user_create_id,
        user_modify_id: user.user_modify_id,
        password: user.password,
        role: user.role,
        rid: user.rid,
        scenario: user.scenario,
        imagen: user.imagen,
        iat: moment_1.default().unix(),
        exp: moment_1.default().add(30, 'days').unix
    };
    return jwt_simple_1.default.encode(payload, secret);
}
exports.createToken = createToken;
