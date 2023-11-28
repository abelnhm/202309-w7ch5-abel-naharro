import { ImgData } from './img.data';

export type LoginUser = {
  email: string;
  passwd: string;
};

export type User = LoginUser & {
  id: string;
  name: string;
  surname: string;
  image: ImgData;
  friends: User[];
  enemies: User[];
};
