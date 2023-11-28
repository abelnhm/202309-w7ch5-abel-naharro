/* eslint-disable camelcase */
import { v2 as cloudinary } from 'cloudinary';
import createDebug from 'debug';
import { ImgData } from '../entities/img.data';
import { HttpError } from '../types/http.error.js';

const debug = createDebug('W7E:SERVICE:CloudinaryMediaFiles');

export class CloudinaryMediaFiles {
  constructor() {
    // Cloudinary.config({
    //   cloud_name: 'dm53t8asy',
    //   api_key: '868185786724441',
    //   api_secret: process.env.CLOUDINARY_SECRET,
    // });
    cloudinary.config({
      secure: true, // Use https
    });
    debug('Instantiated: CloudinaryMediaFiles');
    debug('Cloudinary config:', cloudinary.config());
  }

  uploadImage = async (filePath: string) => {
    try {
      const uploadApiResponse = await cloudinary.uploader.upload(filePath, {
        use_filename: true,
        unique_filename: false,
        folder: 'image-profile',
        overwrite: true,
        format: 'webp',
      });

      const imgData: ImgData = {
        url: uploadApiResponse.url,
        publicId: uploadApiResponse.public_id,
        size: uploadApiResponse.bytes,
        width: uploadApiResponse.width,
        height: uploadApiResponse.height,
        format: uploadApiResponse.format,
      };

      return imgData;
    } catch (err) {
      const error = (err as { error: Error }).error as Error;
      throw new HttpError(
        406,
        'Error uploading image to Cloudinary',
        (error as Error).message
      );
    }
  };
}
