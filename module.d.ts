declare namespace NodeJs {
    export interface ProcessEnv {
        MONGO_name: string
        MONGO_user: string
        MONGO_password: string
        MONGO_host: string
        MONGO_port: string
        JWT_SECRET_KEY: string
        JWT_SECRET_KEY: string;
        ROLES_KEY: string;
    }
}