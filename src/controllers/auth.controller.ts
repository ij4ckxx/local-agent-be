import { Request, Response } from "express";
import { registerUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../validator/auth.schema";
import { loginUser } from "../services/auth.service";


export async function registerHandler(req:Request, res:Response){
    try{
        const validated = registerSchema.parse(req.body);

        const result = await registerUser( validated.name , validated.email, validated.password);
        res.status(201).json({
            success: true,
            user:{
                id: result.user.id,
                name: result.user.name,
                email: result.user.email,
            },
            token: result.token
        })
    }
    catch(err){
        res.status(400).json({
            success:false,
            error: err instanceof Error ? err.message : "Something went wrong"
        })
    }
}

export async function loginHandler(
  req: Request,
  res: Response
) {
  try {
    const validated = loginSchema.parse(req.body);

    const result = await loginUser(
      validated.email,
      validated.password
    );

    res.json({
      success: true,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
      },
      message:`${result.user.name} you have logged in successfully`,
      token: result.token,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Invalid credentials",
    });
  }
}