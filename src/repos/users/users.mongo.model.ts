import { Schema, model } from 'mongoose';
import { User } from '../../entities/user.js';

// Crear el modelo de datos
const usersSchema = new Schema<User>({
  email: { type: String, required: true, unique: true },
  passwd: { type: String, required: true },
  name: { type: String, required: true },
  surname: String,
  friends: [
    {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      unique: true,
    },
  ],
  enemies: [
    {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
      unique: true,
    },
  ],
});

usersSchema.set('toJSON', {
  transform(_doc, returnedObject) {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
    delete returnedObject.passwd;
  },
});

export const UserModel = model<User>('User', usersSchema, 'users');
