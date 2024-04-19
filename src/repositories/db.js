import 'dotenv/config'; 

// dotenv.config();

export const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    options: {
        trustedServerCertificate: true,
        trustedConnection: true,
    }
}