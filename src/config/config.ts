import dotenv from 'dotenv';

dotenv.config();

export const config = {
  app: {
    name: process.env.NAME || 'LITMARK_BACKEND',
    port: process.env.SERVER_PORT || '5000',
  },
  jwt: {
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET as string,
    ACCESS_TOKEN_LIFETIME: process.env.ACCESS_TOKEN_LIFETIME,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET as string,
    REFRESH_TOKEN_LIFETIME: process.env.REFRESH_TOKEN_LIFETIME,
  },
  storage: {
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  },
  database:getActiveDatabase(process.env.ACTIVE_DB || ''),
};

export function getActiveDatabase(db: string) {
  if (db === 'mysql2') {
    return {
      client: db,
      connection: {
        user: process.env.DB_MYSQL_USER,
        password: process.env.DB_MYSQL_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST || '127.0.0.1',
        port: parseInt(process.env.DB_PORT!) || 3306,
      },
    };
  }

  if (db === 'pg') {
    const devlopment = {
      connectionString: process.env.POSTGRES_DB_URI,
      ssl: {
        rejectUnauthorized: false,
      },
    };
    const test = {
      host: process.env.TEST_DB_HOST,
      database: process.env.TEST_DB_DATABASE,
      user: process.env.TEST_DB_USER,
      password: process.env.TEST_DB_PASSWORD,
      port: process.env.TEST_DB_PORT,
    };
    return {
      client: db,
      connection: process.env.NODE_ENV === 'test' ? test : devlopment,
      migrations: {
        directory: `${__dirname}/../migrations`,
      },
    };
  }
}
