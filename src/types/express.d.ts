import 'express';
import type { User as AppUser } from '../models/User';

declare global {
    namespace Express {
        interface User extends AppUser { }
    }
}
