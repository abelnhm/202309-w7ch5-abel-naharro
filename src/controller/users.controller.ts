import { NextFunction, Request, Response } from 'express';
import createDebug from 'debug';
import { UsersMongoRepo } from '../repos/users/users.mongo.repo.js';
import { Auth } from '../services/auth.js';
import { CloudinaryMediaFiles } from '../services/cloudinary.media.files.js';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('W7E:controller');

export class UsersController {
  cloudinaryService: CloudinaryMediaFiles;

  // eslint-disable-next-line no-unused-vars
  constructor(private repo: UsersMongoRepo) {
    debug('Instantiated: UsersController');
    this.cloudinaryService = new CloudinaryMediaFiles();
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.login(req.body);
      // Data es un objeto que contiene el usuario y el token
      const data = {
        user: result,
        token: Auth.signJWT({ id: result.id, email: result.email }),
      };
      res.status(200);
      res.statusMessage = 'Accepted';
      // Devolvemos el usuario y el token
      res.json(data);
    } catch (error) {
      debug('Error, login not possible');
      next(error);
    }
  }

  async getAll(_req: Request, res: Response) {
    const result = await this.repo.getAll();
    res.json(result);
  }

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.getById(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) throw new HttpError(400, 'Image is required');
      // Subimos la imagen a Cloudinary
      const imgData = await this.cloudinaryService.uploadImage(req.file.path);

      // Añadimos la imagen al body de la petición para que se guarde en la base de datos
      req.body.image = {
        publicId: req.file?.filename,
        format: req.file?.mimetype,
        url: req.file?.path,
        size: req.file?.size,
        cloudinaryURL: imgData.url,
      };

      debug('Controller-create:', req.body.image);

      const result = await this.repo.create(req.body);
      res.status(201);
      res.statusMessage = 'Created';
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.repo.update(req.params.id, req.body);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      await this.repo.delete(req.params.id);
      res.status(204);
      res.statusMessage = 'No Content';
      res.json({});
    } catch (error) {
      next(error);
    }
  }
}
