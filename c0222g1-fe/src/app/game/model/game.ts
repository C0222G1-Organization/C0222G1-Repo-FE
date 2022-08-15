import {GameCategory} from "./game-category";

export interface Game {
  id: number;
  name: string;
  createDate: string;
  playedTimes: number;
  trailerUrl: string;
  imageUrl: string;
  content: string;
  gameCategory: GameCategory
}
