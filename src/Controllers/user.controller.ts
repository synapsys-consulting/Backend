import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { User } from "../models/user.model";
import * as jwt from '../services/jwt.service';

const saltRounds = 10;

export function pruebas (req: Request, res: Response): void {
    res.status(200).send({
        "message": "Probando una accion del controlador de suarios de la API de la Plataforma de Compras con MariaDB"
    })
}
export async function saveUser (req: Request, res: Response): Promise<void> {
    let newPassword: string;
    const newFecha = new Date();
    if (!req.body) {
        res.status(400).send({"message": "El contenido del cuerpo no puede estar vacío"});
    } else {
        console.log(req.body);
        if (req.body.password) {
            // encriptar contraseña y guardar datos
            bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                if (err) {
                    res.status(400).send({"message": "Error al encriptar la password"});
                } else {
                    newPassword = hash;
                    console.log(newPassword);
                    if (req.body.user_name && req.body.email && req.body.user_nickname) {
                        // Guardar usuario
                        User.create({
                            user_name : req.body.user_name,
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
                        .then (user => {
                            res.status(200).send(user);
                        })
                        .catch (err => {
                            res.status(500).send({
                                "message": err.message || ". Ocurrió un error mientras que se creaba el usuario."
                            });
                        });
                    }
        
                }
            });
        }
    }
}
export async function updateUser (req: Request, res: Response): Promise<void> {
    const newFecha = new Date();
    const userId: number = parseInt(req.params.id);
    console.log ("El valor del Id a modificar es: " + userId.toString());
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
    await User.update(newUser, { where: { user_id: userId }, returning: true })
    .then(updated  => {
        console.log('El valor de retorno es: ' + updated[0]);
        if (updated[0] === 0) {
			res.status(404).send({ "message": "No se pudo actualizar el usuario ya que no se encontró el usuario en la base de datos." });
		} else {
			res.status(200).send({ "usuariosActualizados": updated[1] });
		}
    })
    .catch (err =>{
        res.status(500).send({ "message": err + ". Se produjo un error en la actualización del usuario." });
    });
}
export async function deleteUser (req: Request, res: Response): Promise<void> {
    const userId: number = parseInt(req.params.id);

    User.destroy({ where: { user_id: userId }})
    .then ((num) => {
        if (num === 1) {
            res.status(200).send( { "message" : "El usuario fue borrado correctamente" } );
        } else {
            res.status(400).send( { "message": "No se borró el usuario. No se pudo encontrar en la base de datos."})
        }
    })
    .catch (err => {
        res.status(500).send( { "message": err + ": Error al intentar borrar el usuario."});
    });
}
export async function loginUser (req: Request, res: Response): Promise<void> {
    const user_name: string = req.body.user_name;
    const password: string = req.body.password;
    const gethash: boolean = req.body.gethash;
    console.log ("El user_name es: " + user_name);
    console.log ("La password es: " + password);
    console.log ("El gethash es: " + gethash);
    await User.findOne({
        where: { user_name: user_name },
    })
    .then (user => {
        if (user) {
            if (user.password) {
                bcrypt.compare (password, user.password, (err: Error, check: boolean) => {
                    if (check) {
                        if (gethash) {
                            res.status(200).send({ "token": jwt.createToken(user) });
                        } else {
                            res.status(200).send({ user });
                        }
                    } else {
                        res.status(404).send({ "message": "El usuario no se ha podido logear. La password no es correcta."});
                    }
                })
            } else {
                res.status(200).send({ "message": "El usuario no se ha podido logear."})
            }
        } else {
            res.status(404).send({ "message": "El usuario no se ha podido logear. El nombre de usuario no existe en el sistema."})
        }
    })
    .catch ((err) => {
        res.status(500).send({"message": err + ". El usuairo no se ha podido logear. Intentelo de nuevo en unos minutos."})
    });
}
export async function changePassword(req: Request, res: Response): Promise<void> {
    const password: string = req.body.password;
    const userId: number = parseInt(req.params.id);
    console.log ("La password es: " + password);
    console.log ("El user_id es: " + userId.toString());
    await User.findByPk(userId)
    .then (user => {
        if (user) {
            if (user.password && password) {
                bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
                    if (err) {
                        res.status(400).send({"message": "Error al encriptar la password"});
                    } else {
                        const newPassword: string = hash;
                        console.log(newPassword);
                        const newUser = {
                            password: newPassword,
                        };
                        User.update(newUser, { where: { user_id: userId }, returning: true })
                        .then(updated  => {
                            console.log('El valor de retorno es: ' + updated[0]);
                            if (updated[0] === 0) {
                                res.status(404).send({ "message": "No se pudo actualizar el usuario ya que no se encontró el usuario en la base de datos." });
                            } else {
                                res.status(200).send({ "usuariosActualizados": updated[1] });
                            }
                        })
                        .catch (err =>{
                            res.status(500).send({ "message": err + ". Se produjo un error en la actualización del usuario." });
                        });                    
                    }
                })
            }
        }
    })
}