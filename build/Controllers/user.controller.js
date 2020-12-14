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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changePassword = exports.loginUser = exports.deleteUser = exports.updateUser = exports.saveUser = exports.pruebas = void 0;
const bcrypt = __importStar(require("bcrypt"));
const user_model_1 = require("../models/user.model");
const jwt = __importStar(require("../services/jwt.service"));
const saltRounds = 10;
function pruebas(req, res) {
    res.status(200).send({
        "message": "Probando una accion del controlador de suarios de la API de la Plataforma de Compras con MariaDB"
    });
}
exports.pruebas = pruebas;
function saveUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        let newPassword;
        const newFecha = new Date();
        if (!req.body) {
            res.status(400).send({ "message": "El contenido del cuerpo no puede estar vacío" });
        }
        else {
            console.log(req.body);
            if (req.body.password) {
                // encriptar contraseña y guardar datos
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (err) {
                        res.status(400).send({ "message": "Error al encriptar la password" });
                    }
                    else {
                        newPassword = hash;
                        console.log(newPassword);
                        if (req.body.user_name && req.body.email && req.body.user_nickname) {
                            // Guardar usuario
                            user_model_1.User.create({
                                user_name: req.body.user_name,
                                user_lastname: req.body.user_lastname,
                                user_firstname: req.body.user_firstname,
                                phone_number: req.body.phone_number,
                                email: req.body.email,
                                birth_date: req.body.birth_date,
                                zip_code: req.body.zip_code,
                                user_nickname: req.body.user_nickname,
                                status_id: req.body.status_id,
                                eff_date: req.body.eff_date,
                                exp_date: req.body.exp_date,
                                status_date: newFecha,
                                user_create_id: "APP_KRRIDM",
                                //user_modify_id: "APP_KRRIDM",
                                password: newPassword,
                                role: req.body.role,
                                rid: req.body.rid,
                                scenario: 'G',
                                imagen: req.body.imagen
                            })
                                .then(user => {
                                res.status(200).send(user);
                            })
                                .catch(err => {
                                res.status(500).send({
                                    "message": err.message || ". Ocurrió un error mientras que se creaba el usuario."
                                });
                            });
                        }
                    }
                });
            }
        }
    });
}
exports.saveUser = saveUser;
function updateUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const newFecha = new Date();
        const userId = parseInt(req.params.id);
        console.log("El valor del Id a modificar es: " + userId.toString());
        const newUser = {
            user_lastname: req.body.user_lastname,
            user_firstname: req.body.user_firstname,
            phone_number: req.body.phone_number,
            email: req.body.email,
            birth_date: req.body.birth_date,
            zip_code: req.body.zip_code,
            user_nickname: req.body.user_nickname,
            status_id: req.body.status_id,
            eff_date: req.body.eff_date,
            exp_date: req.body.exp_date,
            status_date: newFecha,
            user_create_id: "APP_KRRIDM",
            role: req.body.role,
            scenario: 'G',
            imagen: req.body.imagen
        };
        console.log("El usuario que no viene es:");
        console.log(newUser);
        yield user_model_1.User.update(newUser, { where: { user_id: userId }, returning: true })
            .then(updated => {
            console.log('El valor de retorno es: ' + updated[0]);
            if (updated[0] === 0) {
                res.status(404).send({ "message": "No se pudo actualizar el usuario ya que no se encontró el usuario en la base de datos." });
            }
            else {
                res.status(200).send({ "usuariosActualizados": updated[1] });
            }
        })
            .catch(err => {
            res.status(500).send({ "message": err + ". Se produjo un error en la actualización del usuario." });
        });
    });
}
exports.updateUser = updateUser;
function deleteUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const userId = parseInt(req.params.id);
        user_model_1.User.destroy({ where: { user_id: userId } })
            .then((num) => {
            if (num === 1) {
                res.status(200).send({ "message": "El usuario fue borrado correctamente" });
            }
            else {
                res.status(400).send({ "message": "No se borró el usuario. No se pudo encontrar en la base de datos." });
            }
        })
            .catch(err => {
            res.status(500).send({ "message": err + ": Error al intentar borrar el usuario." });
        });
    });
}
exports.deleteUser = deleteUser;
function loginUser(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const user_name = req.body.user_name;
        const password = req.body.password;
        const gethash = req.body.gethash;
        console.log("El user_name es: " + user_name);
        console.log("La password es: " + password);
        console.log("El gethash es: " + gethash);
        yield user_model_1.User.findOne({
            where: { user_name: user_name },
        })
            .then(user => {
            if (user) {
                if (user.password) {
                    bcrypt.compare(password, user.password, (err, check) => {
                        if (check) {
                            if (gethash) {
                                res.status(200).send({ "token": jwt.createToken(user) });
                            }
                            else {
                                res.status(200).send({ user });
                            }
                        }
                        else {
                            res.status(404).send({ "message": "El usuario no se ha podido logear. La password no es correcta." });
                        }
                    });
                }
                else {
                    res.status(200).send({ "message": "El usuario no se ha podido logear." });
                }
            }
            else {
                res.status(404).send({ "message": "El usuario no se ha podido logear. El nombre de usuario no existe en el sistema." });
            }
        })
            .catch((err) => {
            res.status(500).send({ "message": err + ". El usuairo no se ha podido logear. Intentelo de nuevo en unos minutos." });
        });
    });
}
exports.loginUser = loginUser;
function changePassword(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const password = req.body.password;
        const userId = parseInt(req.params.id);
        console.log("La password es: " + password);
        console.log("El user_id es: " + userId.toString());
        yield user_model_1.User.findByPk(userId)
            .then(user => {
            if (user) {
                if (user.password && password) {
                    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                        if (err) {
                            res.status(400).send({ "message": "Error al encriptar la password" });
                        }
                        else {
                            const newPassword = hash;
                            console.log(newPassword);
                            const newUser = {
                                password: newPassword,
                            };
                            user_model_1.User.update(newUser, { where: { user_id: userId }, returning: true })
                                .then(updated => {
                                console.log('El valor de retorno es: ' + updated[0]);
                                if (updated[0] === 0) {
                                    res.status(404).send({ "message": "No se pudo actualizar el usuario ya que no se encontró el usuario en la base de datos." });
                                }
                                else {
                                    res.status(200).send({ "usuariosActualizados": updated[1] });
                                }
                            })
                                .catch(err => {
                                res.status(500).send({ "message": err + ". Se produjo un error en la actualización del usuario." });
                            });
                        }
                    });
                }
            }
        });
    });
}
exports.changePassword = changePassword;
