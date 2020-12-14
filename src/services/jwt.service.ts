import jwtSimple from 'jwt-simple';
import moment from 'moment';
import { User } from '../models/user.model';

const secret = '895.ClAvE_PlAtAfOrMa_COMPRAS?3295_SeCrEtA?5874';

export interface Payload {
	user_id: number;
	user_name: string;
	user_lastname: string;
	user_firstname: string;
	phone_number: string;
	email: string;
	zip_code: string;
	user_nickname: string;
	status_id: string,
	eff_date: Date,
	exp_date: Date,
	user_create_id: string,
	user_modify_id: string,
	password: string,
	role: string,
	rid: string,
	scenario: string
	imagen: string;
	iat: number;
	exp: number;

}
export function createToken(user: User): string {
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
		iat: moment().unix(),
		exp: moment().add(30, 'days').unix
    };
    return jwtSimple.encode(payload, secret);
}
