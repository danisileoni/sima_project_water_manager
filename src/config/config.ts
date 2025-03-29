import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  DB_POSTGRES_HOST: string;
  DB_POSTGRES_PORT: number;
  DB_POSTGRES_USER: string;
  DB_POSTGRES_PASSWORD: string;
  DB_POSTGRES_NAME: string;
  JWT_SECRET: string;
  JWT_SECRET_REFRESH: string;
  API_KEY_EMAIL: string;
  API_KEY_EMAIL_PASS: string;
  MAIL_SMTP: string;
  MAIL_PORT: number;
  MAIL_USER: string;
  MAIL_PASS: string;
  MAIL_FROM: string;
  PORT: number;
  EXPRESS_SESSION_KEY: string;
}

const envsSchema = joi
  .object<EnvVars>({
    DB_POSTGRES_HOST: joi.string().required(),
    DB_POSTGRES_PORT: joi.number().required(),
    DB_POSTGRES_USER: joi.string().required(),
    DB_POSTGRES_PASSWORD: joi.string().required(),
    DB_POSTGRES_NAME: joi.string().required(),
    JWT_SECRET: joi.string().required(),
    JWT_SECRET_REFRESH: joi.string().required(),
    API_KEY_EMAIL: joi.string().required(),
    API_KEY_EMAIL_PASS: joi.string().required(),
    MAIL_SMTP: joi.string().required(),
    MAIL_PORT: joi.number().required(),
    MAIL_USER: joi.string().required(),
    MAIL_PASS: joi.string().required(),
    MAIL_FROM: joi.string().required(),
    PORT: joi.number().required(),
    EXPRESS_SESSION_KEY: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  console.log(error);
  throw new Error(`Config Valitation error: \${error.message}`);
}

const envsVars: EnvVars = value;

export const envs = {
  dbPostgresHost: envsVars.DB_POSTGRES_HOST,
  dbPostgresPort: envsVars.DB_POSTGRES_PORT,
  dbPostgresUser: envsVars.DB_POSTGRES_USER,
  dbPostgresPassword: envsVars.DB_POSTGRES_PASSWORD,
  dbPostgresName: envsVars.DB_POSTGRES_NAME,
  jwtSecret: envsVars.JWT_SECRET,
  jwtSecretRefresh: envsVars.JWT_SECRET_REFRESH,
  apiKeyEmail: envsVars.API_KEY_EMAIL,
  apiKeyEmailPass: envsVars.API_KEY_EMAIL_PASS,
  mailSmtp: envsVars.MAIL_SMTP,
  mailPort: envsVars.MAIL_PORT,
  mailUser: envsVars.MAIL_USER,
  mailPass: envsVars.MAIL_PASS,
  mailFrom: envsVars.MAIL_FROM,
  port: envsVars.PORT,
  expressSessionKey: envsVars.EXPRESS_SESSION_KEY,
};
