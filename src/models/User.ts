import AuthProvider from './AuthProvider.js';

export interface User {
    id: number;
    email?: string;
    username?: string;
    authProvider?: typeof AuthProvider;
    theme?: string;
    surName?: string;
}