import {GameCategory} from './game-category';

export interface News {
  id?: number;
  title?: string;
  imageUrl?: string;
  content?: string;
  createDate?: string;
  views?: number;
  author?: string;
  gameCategory: GameCategory;
}
