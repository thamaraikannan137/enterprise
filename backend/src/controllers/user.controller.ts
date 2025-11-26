import type { Response, NextFunction, Request } from "express";
import userService from "../services/userService.js";
import { sendSuccess } from "../utils/response.js";
import { SUCCESS_MESSAGES } from "../config/constants.js";

class UserController {
  async getAllUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const result = await userService.getAllUsers(page, limit);

      sendSuccess(res, "Users retrieved successfully", result);
    } catch (error) {
      next(error);
    }
  }

  async getUserById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const user = await userService.getUserById(id);
      const userObject = user.toJSON();

      sendSuccess(res, "User retrieved successfully", { user: userObject });
    } catch (error) {
      next(error);
    }
  }

  async updateUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      const updateData = req.body;
      const user = await userService.updateUser(id, updateData);
      const userObject = user.toJSON();

      sendSuccess(res, SUCCESS_MESSAGES.USER_UPDATED, { user: userObject });
    } catch (error) {
      next(error);
    }
  }

  async deleteUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id!;
      await userService.deleteUser(id);

      sendSuccess(res, SUCCESS_MESSAGES.USER_DELETED);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
