import { generateAccessToken, generateRefreshToken } from "../utils/jwt.js";
import userService from "./userService.js";

class AuthService {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const user = await userService.createUser(data);

    const userId = user._id.toString();
    
    const accessToken = generateAccessToken({
      userId,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId,
      email: user.email,
      role: user.role,
    });

    const userObject = user.toJSON();

    return {
      user: userObject,
      accessToken,
      refreshToken,
    };
  }

  async login(email: string, password: string) {
    const user = await userService.verifyPassword(email, password);

    const userId = user._id.toString();

    const accessToken = generateAccessToken({
      userId,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId,
      email: user.email,
      role: user.role,
    });

    const userObject = user.toJSON();

    return {
      user: userObject,
      accessToken,
      refreshToken,
    };
  }

  async refreshToken(refreshToken: string) {
    const { verifyRefreshToken } = await import("../utils/jwt.js");
    const decoded = verifyRefreshToken(refreshToken);

    const user = await userService.getUserById(decoded.userId);

    const userId = user._id.toString();

    const newAccessToken = generateAccessToken({
      userId,
      email: user.email,
      role: user.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }
}

export default new AuthService();
