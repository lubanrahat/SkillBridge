import type { Request, Response } from "express";
import { catchAsync } from "../../utils/asyncHandler";
import AuthService from "./auth.service";
import { ResponseUtil } from "../../utils/response.util";

class AuthController {
  public register = catchAsync(async (req: Request, res: Response) => {
    const service = new AuthService();
    const result = await service.register(req.body);
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    };
    res.cookie("token", result.token, cookieOptions);
    return ResponseUtil.success(res, result, "User created successfully", 201);
  });

  public login = catchAsync(async (req: Request, res: Response) => {
    const service = new AuthService();
    const result = await service.login(req.body);
    const cookieOptions = {
      httpOnly: true,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) 
    };
    res.cookie("token", result.token, cookieOptions);
    return ResponseUtil.success(res, result, "User logged in successfully", 200);
  });
}

export default AuthController;
