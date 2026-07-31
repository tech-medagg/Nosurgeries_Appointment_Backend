import bcrypt from "bcrypt";

import { RegisterInput, LoginInput } from "./auth.validation";
import * as authRepository from "./auth.repository";
import { generateAccessToken } from "../../utils/jwt";

export const register = async (data: RegisterInput) => {
  const existingEmail = await authRepository.findUserByEmail(data.email);

  if (existingEmail) {
    return {
      success: false,
      message: "Email already exists",
    };
  }

  const existingMobile = await authRepository.findUserByMobile(data.mobile);

  if (existingMobile) {
    return {
      success: false,
      message: "Mobile number already exists",
    };
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await authRepository.createUser({
    ...data,
    password: hashedPassword,
  });

  // Strict mode safety
  if (!user) {
    throw new Error("Failed to create user");
  }

  const { password, ...safeUser } = user;

  return {
    success: true,
    message: "User registered successfully",
    data: safeUser,
  };
};

export const login = async (data: LoginInput) => {
  const user = await authRepository.findUserByMobile(data.mobile);

  if (!user) {
    return {
      success: false,
      message: "Invalid mobile number or password",
    };
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.password
  );

  if (!isPasswordValid) {
    return {
      success: false,
      message: "Invalid mobile number or password",
    };
  }

  const accessToken = generateAccessToken({
    userId: user.id,
    roleId: user.roleId,
    roleName: user.roleName,
    email: user.email,
  });

  const { password, ...safeUser } = user;

  return {
    success: true,
    message: "Login successful",
    data: {
      accessToken,
      user: safeUser,
    },
  };
};