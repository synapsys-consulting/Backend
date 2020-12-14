import { Request, Response } from "express";
import { NextFunction } from 'express';
import jwt from 'jwt-simple';
import moment from 'moment';
import { Payload } from '../services/jwt.service';

const secret = '895.ClAvE_PlAtAfOrMa_COMPRAS?3295_SeCrEtA?5874';

export function ensureAuth(req: Request, res: Response, next: NextFunction): void {
	let payload: Payload;
	if (!req.headers.authorization) {
		res.status(403).send({message: 'La peticion no tiene la cabecera de autenticación'});
	} else {
		try {
			const token: string = req.headers.authorization.replace(/['"]+/g, '');
			payload = jwt.decode(token, secret);
			if (payload.exp <= moment().unix()){
				res.status(401).send({message: 'El token ha expirado'});
			}
			req.user = payload;
			next();	
		} catch (ex) {
			//console.log(ex);
			res.status(404).send({message: 'Token no valido'});
		}	
	}
}