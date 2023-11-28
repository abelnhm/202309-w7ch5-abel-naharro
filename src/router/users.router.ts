import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';
import { UsersController } from '../controller/users.controller.js';
import { AuthInterceptor } from '../middleware/auth.interceptor.js';
import { FileInterceptor } from '../middleware/file.interceptor.js';

const debug = createDebug('W7E:router');

export const usersRouter = createRouter();
const interceptor = new AuthInterceptor();
debug('Starting');

const repo = new UsersMongoRepo();
const controller = new UsersController(repo);
const fileInterceptor = new FileInterceptor();

usersRouter.get(
  '/',
  interceptor.authorization.bind(interceptor),
  controller.getAll.bind(controller)
);
usersRouter.get(
  '/:id',
  interceptor.authorization.bind(interceptor),
  controller.getById.bind(controller)
);
usersRouter.patch('/:id', controller.update.bind(controller));

usersRouter.post(
  '/register',
  fileInterceptor.singleFileStore('image').bind(fileInterceptor),
  controller.create.bind(controller)
);
usersRouter.post('/login', controller.login.bind(controller));
