import * as userRepository from "./user.repository";

export const getAllUsers = async (params: any) => {
  const users = await userRepository.getAllUsers(params);

  return {
    success: true,
    message: "Users fetched successfully",
    data: users,
  };
};

export const getUserById = async (id: string) => {
  const user = await userRepository.getUserById(id);

  if (!user) {
    return {
      success: false,
      message: "User not found",
    };
  }

  return {
    success: true,
    message: "User fetched successfully",
    data: user,
  };
};