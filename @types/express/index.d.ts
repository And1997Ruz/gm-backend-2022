import { Category } from "../../src/models/Category";
import { Item } from "../../src/models/Item";
import { User } from "../../src/models/User";
import uploadedFile from "./../../src/models/uploadedFile";

declare global {
  namespace Express {
    interface Request {
      category: Category;
      item: Item;
      user: User;
      file: uploadedFile;
    }
    interface Response {
      category: Category;
      item: Item;
      user: User;
      file: uploadedFile;
    }
  }
}
