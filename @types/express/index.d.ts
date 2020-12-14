import { Payload } from '../../src/services/jwt.service';

declare global{
    namespace Express {
        interface Request {
            user: Payload
        }
    }
}