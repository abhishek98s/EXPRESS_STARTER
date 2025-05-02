import supertest from 'supertest';
import knex from '../config/knex.config';
import app from '../app';

import * as UserServices from '../entities/user/user.service';
import { UserSeed } from '../seeds/2_users';
import { authExceptionMessages } from '../auth/constant/authExceptionMessages';
import { authSuccessMessages } from '../auth/constant/authSuccessMessages';
import { userExceptionMessages } from '../entities/user/constant/userExceptionMessages';

const api = supertest(app);

describe('Authentication', () => {
  beforeAll(async () => {
    await knex.migrate.rollback();
    await knex.migrate.latest();
    await knex.seed.run({ directory: 'src/seeds' });
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 for empty email and password', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({})
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_REQUIRED);
    });

    it('should return 400 check for missing email', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          password: 'password',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_REQUIRED);
    });

    it('should return 400 check for email is string', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 111,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_STRING);
    });

    it('should return 400 check for invalid email', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_INVALID);
    });

    it('should return 400 check for missing password', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        authExceptionMessages.PASSWORD_REQUIRED,
      );
    });

    it('should return 400 check for string', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
          password: 111,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.PASSWORD_STRING);
    });

    it('should return 401 check for non existent user', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
          password: 'password',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(401);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.USER_NOT_FOUND);
    });

    it('should return 400 for extra property', async () => {
      const response = await api
        .post('/api/auth/login')
        .send({
          email: 'user@gmail.com',
          password: 'password',
          extra: 'extra',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EXTRA_PROPERTY);
    });

    describe('When user exits', () => {
      const { username, email, password } = UserSeed[1];
      beforeAll(async () => {
        try {
          const user = {
            username,
            email,
            password,
            image_id: 0,
            isdeleted: false,
            role: 'normal',
            created_by: username,
            updated_by: username,
          };
          await UserServices.addUser({ ...user });
        } catch (err) {
          const msg = (err as Error).message;

          if (msg !== userExceptionMessages.EMAIL_EXITS) {
            console.log(msg);
          }
        }
      });

      it('should return 401 check for invalid credentials', async () => {
        const response = await api
          .post('/api/auth/login')
          .send({
            email,
            password: 'password',
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(401);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(
          authExceptionMessages.INVALID_CREDENTIALS,
        );
      });

      it('should return 200 check for valid credentials', async () => {
        const response = await api
          .post('/api/auth/login')
          .send({
            email,
            password,
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(authSuccessMessages.LOGIN_SUCCESS);
      });
    });
  });

  describe('POST /api/auth/register', () => {
    it('should return 400 for empty username, email, and password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({})
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        authExceptionMessages.USERNAME_REQUIRED,
      );
    });

    it('should return 400 for empty username', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ email: 'test@example.com', password: 'password123' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        authExceptionMessages.USERNAME_REQUIRED,
      );
    });

    it('should return 400 for username must be a string', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 123,
          email: 'test@example.com',
          password: 'password123',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.USERNAME_STRING);
    });

    it('should return 400 for missing password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@example.com' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(
        authExceptionMessages.PASSWORD_REQUIRED,
      );
    });

    it('should return 400 for empty password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: 'test@example.com', password: '' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.PASSWORD_EMPTY);
    });

    it('should return 400 for password must be 8 characters long', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'short',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.PASSWORD_SHORT);
    });

    it('should return 400 for password must be a string', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 12345678,
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.PASSWORD_STRING);
    });

    it('should return 400 for invalid password', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'invalid',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.PASSWORD_SHORT);
    });

    it('should return 400 for missing email', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', password: 'Password123!' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_REQUIRED);
    });

    it('should return 400 for empty email', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({ username: 'testuser', email: '', password: 'Password123!' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_EMPTY);
    });

    it('should return 400 for invalid email', async () => {
      const response = await api
        .post('/api/auth/register')
        .send({
          username: 'testuser',
          email: 'invalid-email',
          password: 'Password123!',
        })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe(authExceptionMessages.EMAIL_INVALID);
    });

    describe('When user exits', () => {
      const { username, email, password } = UserSeed[0];

      beforeAll(async () => {
        try {
          const user = {
            username,
            email,
            password,
            image_id: 0,
            isdeleted: false,
            role: 'normal',
            created_by: username,
            updated_by: username,
          };
          await UserServices.addUser({ ...user });
        } catch (err) {
          console.log((err as Error).message);
        }
      });

      it('should return 409 for email already exists', async () => {
        const response = await api
          .post('/api/auth/register')
          .send({
            username,
            email,
            password,
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(409);
        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe(userExceptionMessages.EMAIL_EXITS);
      });

      it('should return 200 for successful operation', async () => {
        const response = await api
          .post('/api/auth/register')
          .send({
            username: 'newuser',
            email: 'newuser@example.com',
            password: 'Newuser123!',
          })
          .set('Accept', 'application/json');
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe(
          authSuccessMessages.REGISTER_SUCCESS,
        );
      });
    });
  });

  afterAll(async () => {
    await knex.migrate.rollback();
  });
});
