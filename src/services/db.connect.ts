import mongoose from 'mongoose';
import 'dotenv/config.js';

export const dbConnect = () => {
  const admin = process.env.USER_DB;
  const pass = process.env.PASSWD_DB;
  const dbName = 'social';
  const uri = `mongodb+srv://${admin}:${pass}@cluster0.uscgexi.mongodb.net/${dbName}?retryWrites=true&w=majority`;
  return mongoose.connect(uri);
};
