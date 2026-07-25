import bcrypt from "bcrypt";

import { RegisterInput } from "./auth.validation";
import * as authRepository from "./auth.repository";

export const register = async (data: RegisterInput) => {
  // Check email
  const existingEmail = await authRepository.findUserByEmail(data.email);

  if (existingEmail) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  // Check mobile
  const existingMobile = await authRepository.findUserByMobile(data.mobile);

  if (existingMobile) {
    return {
      success: false,
      message: "Mobile number already exists",
    };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create user
  const user = await authRepository.createUser({
    ...data,
    password: hashedPassword,
  });

  return {
    success: true,
    message: "User registered successfully",
    data: user,
  };
};