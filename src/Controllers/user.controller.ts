import { Request, Response } from "express";
import * as bcrypt from "bcrypt";
import { User } from "../models/user.model";
import { PersoneIdentity } from "../models/personeIdentity.model";
import { UserRole } from "../models/userRole.model";
import { sequelize } from "../models/db.model";
import * as jwt from '../services/jwt.service';
import * as Querys from "../models/queries.model";
import { QueryTypes } from "sequelize";

const saltRounds = 10;

export function pruebas (req: Request, res: Response): void {
    res.status(200).send({
        "message": "Probando una accion del controlador de suarios de la API de la Plataforma de Compras con MariaDB"
    })
}
export async function saveUser (req: Request, res: Response): Promise<void> {
    let newPassword: string;
    const newFecha = new Date();
    const userName: string = req.body.user_name
    const userFirstName: string = req.body.user_firstname;
    const userLastName: string = req.body.user_lastname;
    const password: string = req.body.password;
    const gethash: string = req.body.gethash;

    console.log ("Firstname es: " + userFirstName);
    console.log ("Lastname es: " + userLastName);
    
    if (!req.body) {
        res.status(400).send({"message": "El contenido del cuerpo no puede estar vacío"});
    } else {
        console.log(req.body);
        if (password) {
            const transact = await sequelize.transaction();
            try {
                // encriptar contraseña y guardar datos
                newPassword = await bcrypt.hash (password, saltRounds);
                const user: User = await User.create ({
                    user_name : userName,
                    user_lastname: userLastName,
                    user_firstname: userFirstName,
                    //phone_number: req.body.phone_number,
                    email: userName,
                    //birth_date: req.body.birth_date,
                    //zip_code: req.body.zip_code,
                    //user_nickname: req.body.user_nickname,
                    //status_id: req.body.status_id,
                    status_id: 'A',
                    //eff_date: req.body.eff_date,
                    //exp_date: req.body.exp_date,
                    status_date: newFecha,
                    user_create_id: 1,
                    //user_modify_id: "APP_KRRIDM",
                    password: newPassword,
                    role: 'Usuario',
                    //rid: req.body.rid,
                    scenario: 'APP',
                    //imagen: req.body.imagen
                },
                {
                    transaction: transact
                });
                await PersoneIdentity.create({
                    persone_name: userFirstName + ' ' + userLastName,
                    persone_type: "C",
                    status_date: newFecha,
                    status_id: "A",
                    user_create_id: user.user_id,
                    scenario: "APP",
                    currency_id: "EUR",
                    language_code: "es-ES",
                    email: userName,
                    user_id: user.user_id
                },
                {
                    transaction: transact
                });
                if (gethash === "true") {
                    res.status(200).send( { "token": jwt.createToken(user) });
                } else {
                    res.status(200).send( {user} );
                }
                transact.commit();
            } catch (err) {
                console.log (err);
                transact.rollback();
                res.status(500).send({message: err || " . Ocurrió un error mientras que se creaba el usuario."});
            }
        } else {
            res.status(400).send({"message": "Debe introducirse una password"});
        }
    }
}
export async function saveUserWithPersoneId (req: Request, res: Response): Promise<void> {
    let newPassword: string;
    const newFecha = new Date();
    const userName: string = req.body.user_name
    const userFirstName: string = req.body.user_firstname;
    const userLastName: string = req.body.user_lastname;
    const password: string = req.body.password;
    const gethash: string = req.body.gethash;

    console.log ("Firstname es: " + userFirstName);
    console.log ("Lastname es: " + userLastName);
    
    if (!req.body) {
        res.status(400).send({"message": "El contenido del cuerpo no puede estar vacío"});
    } else {
        console.log(req.body);
        if (password) {
            const transact = await sequelize.transaction();
            try {
                // encriptar contraseña y guardar datos
                newPassword = await bcrypt.hash (password, saltRounds);
                const personeIdentity = await PersoneIdentity.findOne({
                    where: { email: userName }
                });
                if (personeIdentity) {
                    const user: User = await User.create ({
                        user_name : userName,
                        user_lastname: userLastName,
                        user_firstname: userFirstName,
                        //phone_number: req.body.phone_number,
                        email: userName,
                        //birth_date: req.body.birth_date,
                        //zip_code: req.body.zip_code,
                        //user_nickname: req.body.user_nickname,
                        //status_id: req.body.status_id,
                        status_id: 'A',
                        eff_date: newFecha,
                        //exp_date: req.body.exp_date,
                        status_date: newFecha,
                        user_create_id: 1,
                        //user_modify_id: "APP_KRRIDM",
                        password: newPassword,
                        role: personeIdentity.persone_type == "C" ? 'BUYER' : 'SELLER',   // if PERDONE_TYPE of KRC_PERSONE_IDENTITY = "C" then "BUYER" else "SELLER",
                        //rid: req.body.rid,
                        scenario: 'APP',
                        //imagen: req.body.imagen
                    },
                    {
                        transaction: transact
                    });
                    await UserRole.create({
                        user_id: user.user_id,
                        role_id: personeIdentity.persone_type == "C" ? 1 : 2,   // if PERDONE_TYPE of KRC_PERSONE_IDENTITY = "C" then "BUYER" else "SELLER"
                        status_id : "A",
                        status_date: newFecha,
                        eff_date: newFecha,
                        user_create_id: user.user_id
                    },
                    {
                        transaction: transact   
                    });
                    const newPersoneIdentity = {
                        status_id: 'A',
                        user_id: user.user_id,
                        user_modify_id: user.user_id,
                        status_date: newFecha
                    };
                    const updated = await PersoneIdentity.update (
                        newPersoneIdentity,
                        { 
                            where: 
                                {
                                    email: userName 
                                }, 
                            returning: true,
                            transaction: transact
                        }
                    );
                    if (updated[0] === 0) {
                        transact.rollback();
                        res.status(404).send({ "message": "No se pudo registrar el usuario ya que no se encontró dicho usuario en la base de datos." });
                    } else {
                        transact.commit();
                        if (gethash === "true") {
                            res.status(200).send( { "token": jwt.createTokenWithPersoneId(user, personeIdentity) });
                        } else {
                            const userWithPersoneId = {
                                user_id: user.user_id,
                                user_name: user.user_name, 
                                user_lastname: user.user_lastname,
                                user_firstname: user.user_firstname,
                                phone_number: user.phone_number,
                                email: user.email,
                                birth_date: user.birth_date,
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
                                imagen: user.imagen,
                                scenario: user.scenario,
                                persone_id: personeIdentity.persone_id
                            };
                            res.status(200).send( {userWithPersoneId} );
                        }
                    }
                } else {
                    const user: User = await User.create({
                        user_name : userName,
                        user_lastname: userLastName,
                        user_firstname: userFirstName,
                        //phone_number: req.body.phone_number,
                        email: userName,
                        //birth_date: req.body.birth_date,
                        //zip_code: req.body.zip_code,
                        //user_nickname: req.body.user_nickname,
                        //status_id: req.body.status_id,
                        status_id: 'A',
                        //eff_date: req.body.eff_date,
                        //exp_date: req.body.exp_date,
                        status_date: newFecha,
                        user_create_id: 1,
                        //user_modify_id: "APP_KRRIDM",
                        password: newPassword,
                        role: 'BUYER',   // by default the user is "BUYER"
                        //rid: req.body.rid,
                        scenario: 'APP',
                        //imagen: req.body.imagen
                    },
                    {
                        transaction: transact
                    });
                    await UserRole.create({
                        user_id: user.user_id,
                        role_id: 1,     // 1: BUYER  2: SELLER
                        status_id : "A",
                        status_date: newFecha,
                        eff_date: newFecha,
                        user_create_id: user.user_id
                    },
                    {
                        transaction: transact   
                    });
                    const personeIdentity = await PersoneIdentity.create({
                        persone_name: userFirstName + ' ' + userLastName,
                        persone_type: "C",
                        status_date: newFecha,
                        status_id: "A",
                        user_create_id: user.user_id,
                        scenario: "APP",
                        currency_id: "EUR",
                        language_code: "es-ES",
                        email: userName,
                        user_id: user.user_id,
                        partner_id: 1,
                        partner_name: 'SIN PARTNER'
                    },
                    {
                        transaction: transact
                    });
                    transact.commit();
                    if (gethash === "true") {
                        res.status(200).send( { "token": jwt.createTokenWithPersoneId(user, personeIdentity) });
                    } else {
                        const userWithPersoneId = {
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
                            persone_id: personeIdentity.persone_id,
                            partner_id: personeIdentity.partner_id,
                            partner_name: personeIdentity.partner_name,
                        };
                        res.status(200).send( {userWithPersoneId} );
                    }
                }
            } catch (err) {
                console.log (err);
                transact.rollback();
                res.status(500).send({message: err || " . Ocurrió un error mientras que se creaba el usuario."});
            }
        } else {
            res.status(400).send({"message": "Debe introducirse una password"});
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
        user_name: req.body.user_name,
        email: req.body.user_name,
        birth_date: req.body.birth_date,
        zip_code: req.body.zip_code,
        user_nickname: req.body.user_nickname,
        status_id: req.body.status_id,
        eff_date: req.body.eff_date,
        exp_date: req.body.exp_date,
        status_date: newFecha,
        user_create_id: 1,
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
export async function updateUserWithPersoneId (req: Request, res: Response): Promise<void> {
    const newFecha = new Date();
    const userId: number = parseInt(req.params.id);
    const gethash: boolean = req.body.gethash;
    console.log ("El valor del Id a modificar es: " + userId.toString());
    const newUser = {
        user_lastname: req.body.user_lastname,
        user_firstname: req.body.user_firstname,
        phone_number: req.body.phone_number,
        user_name: req.body.user_name,
        email: req.body.user_name,
        birth_date: req.body.birth_date,
        zip_code: req.body.zip_code,
        user_nickname: req.body.user_nickname,
        status_id: req.body.status_id,
        eff_date: req.body.eff_date,
        exp_date: req.body.exp_date,
        status_date: newFecha,
        user_modify_id: userId,
        role: req.body.role,
        scenario: 'G',
        imagen: req.body.imagen
    };
    console.log("El usuario que no viene es:");
    console.log(newUser);
    try {
        const updated = await User.update (newUser, { where: { user_id: userId }, returning: true });
        console.log('El valor de retorno es: ' + updated[0]);
        if (updated[0] === 0) {
            res.status(404).send({ "message": "No se pudo actualizar el usuario ya que no se encontró el usuario en la base de datos." });
        } else {
            const user = await User.findOne({
                where: { user_id: userId }
            });
            if (user) {
                const personeIdentity = await PersoneIdentity.findOne({
                    where: { user_id: user.user_id}
                });
                if (personeIdentity) {
                    if (gethash) {
                        res.status(200).send({ "token": jwt.createTokenWithPersoneId(user, personeIdentity) });
                    } else {
                        const userWithPersoneId = {
                            user_id: user.user_id,
                            user_name: user.user_name, 
                            user_lastname: user.user_lastname,
                            user_firstname: user.user_firstname,
                            phone_number: user.phone_number,
                            email: user.email,
                            birth_date: user.birth_date,
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
                            imagen: user.imagen,
                            scenario: user.scenario,
                            persone_id: personeIdentity.persone_id
                        };
                        res.status(200).send({ userWithPersoneId });
                    }
                } else {
                    res.status(200).send({ "token": jwt.createToken(user) });
                }
            } else {
                res.status(404).send({ "message": "Aunque se actualizó el usuario no se pudieron enviar a su movil los datos actualizados." });
            }
        }
    } catch (err) {
        console.log (err);
        res.status(500).send({message: err || ". Se produjo un error en la actualización del usuario."});
    }
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
                });
            } else {
                res.status(200).send({ "message": "El usuario no se ha podido logear."})
            }
        } else {
            res.status(404).send({ "message": "El usuario no se ha podido logear. El nombre de usuario no existe en el sistema."});
        }
    })
    .catch ((err) => {
        res.status(500).send({"message": err + ". El usuairo no se ha podido logear. Intentelo de nuevo en unos minutos."});
    });
}

export async function loginUserWithPersoneId (req: Request, res: Response): Promise<void> {
    const user_name: string = req.body.user_name;
    const password: string = req.body.password;
    const gethash: boolean = req.body.gethash;
    console.log ("El user_name es: " + user_name);
    console.log ("La password es: " + password);
    console.log ("El gethash es: " + gethash);
    interface roleUser {
        ROLE_ID: number,
        ROLE_NAME: string,
    }
    try {
        const user = await User.findOne({
            where: { user_name: user_name, status_id: 'A' }
        });
        if (user) {
            if (user.password) {
                const match = await bcrypt.compare (password, user.password);
                if (match) {
                    const data = <Array<roleUser>>await sequelize.query (
                        Querys.getRoleByUser(),
                        {
                            bind: [ user.user_id ],
                            raw: true,
                            type: QueryTypes.SELECT
                        }
                    );
                    if (data) {
                        user.role = data[0].ROLE_NAME;
                    } else {
                        user.role = 'BUYER';    // By default the role of the user is BUYER
                    }
                    const personeIdentity = await PersoneIdentity.findOne({
                        where: { user_id: user.user_id, status_id: 'A'}
                    });
                    if (personeIdentity) {
                        if (gethash) {
                            res.status(200).send({ "token": jwt.createTokenWithPersoneId(user, personeIdentity) });
                        } else {
                            const userWithPersoneId = {
                                user_id: user.user_id,
                                user_name: user.user_name, 
                                user_lastname: user.user_lastname,
                                user_firstname: user.user_firstname,
                                phone_number: user.phone_number,
                                email: user.email,
                                birth_date: user.birth_date,
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
                                imagen: user.imagen,
                                scenario: user.scenario,
                                persone_id: personeIdentity.persone_id,
                                partner_id: personeIdentity.partner_id,
                                partner_name: personeIdentity.partner_name
                            };
                            res.status(200).send({ userWithPersoneId });
                        }
                    } else {
                        res.status(404).send({ "message": "El usuario no se ha podido logear. Deben ser confirmadas sus credenciales. Póngase en contacto con el administrador." });
                    }
                } else {
                    res.status(402).send({ "message": "El usuario no se ha podido logear. La password no es correcta."});
                }
            } else {
                res.status(403).send({ "message": "El usuario no se ha podido logear."})
            }
        } else {
            res.status(404).send({ "message": "El usuario no se ha podido logear. El nombre de usuario no existe en el sistema."});
        }
    } catch (err) {
        console.log (err);
        res.status(500).send({message: err || " . Ocurrió un error mientras que se creaba el usuario."});
    }
}
export async function loginWithoutPass (req: Request, res: Response): Promise<void> {
    const user_name: string = req.body.user_name;
    console.log ("El user_name es: " + user_name);
    await User.findOne({
        where: { user_name: user_name, status_id: 'A' },
    })
    .then (user => {
        if (user) {
            res.status(200).send({ user_name: user.user_name });
        } else {
            res.status(404).send({ "message": "El usuario no se ha podido logear. El nombre de usuario no existe en el sistema."});
        }
    })
    .catch((err => {
        res.status(500).send({"message": err + ". El usuario no se ha podido logear. Intentelo de nuevo en unos minutos."});
    }));
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
export async function changePasswordWithPersoneId(req: Request, res: Response): Promise<void> {
    const password: string = req.body.password;
    const userId: number = parseInt(req.params.id);
    const gethash: boolean = req.body.gethash;
    console.log ("La password es: " + password);
    console.log ("El user_id es: " + userId.toString());
    try {
        const user = await User.findByPk(userId);
        if (user) {
            if (user.password && password) {
                const newPassword = await bcrypt.hash (password, saltRounds);
                const newUser = {
                    password: newPassword,
                    user_modify_id: user.user_id 
                }
                //user.password = newPassword;
                const updated = await User.update(newUser, { where: { user_id: userId }, returning: true });
                console.log('El valor de retorno es: ' + updated[0]);
                if (updated[0] === 0) {
                    res.status(404).send({ "message": "No se pudo cambiar la password ya que no se encontró el usuario en la base de datos." });
                } else {
                    const user = await User.findOne({
                        where: { user_id: userId }
                    });
                    if (user) {
                        const personeIdentity = await PersoneIdentity.findOne({
                            where: { user_id: user.user_id}
                        });
                        if (personeIdentity) {
                            if (gethash) {
                                res.status(200).send({ "token": jwt.createTokenWithPersoneId(user, personeIdentity) });
                            } else {
                                const userWithPersoneId = {
                                    user_id: user.user_id,
                                    user_name: user.user_name, 
                                    user_lastname: user.user_lastname,
                                    user_firstname: user.user_firstname,
                                    phone_number: user.phone_number,
                                    email: user.email,
                                    birth_date: user.birth_date,
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
                                    imagen: user.imagen,
                                    scenario: user.scenario,
                                    persone_id: personeIdentity.persone_id
                                };
                                res.status(200).send({ userWithPersoneId });
                            }
                        } else {
                            res.status(200).send({ "token": jwt.createToken(user) });
                        }
                    } else {
                        res.status(404).send({ "message": "Aunque se actualizó el usuario no se pudieron enviar a su movil los datos actualizados." });
                    }
                }
            }
        }
    } catch(err) {
        console.log (err);
        res.status(500).send({ "message": err + ". Se produjo un error en la actualización del usuario." });
    }
}