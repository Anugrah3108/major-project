import { RoleType } from "@/generated/prisma";
import { getUserFromCookies } from "@/service/helper";
import { generateToken } from "@/service/jwt";
import prismaClient from "@/service/prisma";
import { cookies } from "next/headers";

export async function loginUser(
  _: any,
  args: { userCred: string; password: string }
) {
  try {
    const cookieStore = await cookies();
    const user = await prismaClient.user.findUnique({
      where: {
        email: args.userCred,
      },
    });
    if (!user) return false;
    if (user.password === args.password) {
      const token = await generateToken({ id: user.id });
      cookieStore.set("token", token);
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function createUser(
  _: any,
  args: { name: string; email: string; username: string; password: string }
) {
  try {
    const user = await getUserFromCookies();
    if (!user) return null;
    if (user.role != "admin") return null;

    const createdUser = await prismaClient.user.create({
      data: args,
    });
    return createdUser;
  } catch (error: any) {
    console.log(error.message);
    return null;
  }
}

export async function updateUserRole(
  _: any,
  args: {
    userId: string;
    role: RoleType;
  }
) {
  try {
    const user = await getUserFromCookies();
    if (user?.role != "admin") {
      return false;
    }
    const updatedUser = await prismaClient.user.update({
      where: {
        id: args.userId,
      },
      data: {
        role: args.role,
      },
    });
    if (updatedUser) {
      return true;
    }
  } catch (error: any) {
    console.log(error.message);

    return false;
  }
}

export async function updateUserProfile(
  _: any,
  args: {
    userId: string;
    name: string;
    email: string;
    username: string;
    avatar: string;
  }
) {
  try {
    const dataTosave = {
      name: args.name,
      username: args.username,
      avatar: args.avatar,
      email: args.email,
    };
    const user = await getUserFromCookies();
    if (user?.role != "admin" && user?.id != args.userId) return false;

    const existingUser = await prismaClient.user.findUnique({
      where: { username: args.username },
    });
    if (existingUser && existingUser.id !== args.userId) {
      return false;
    }

    await prismaClient.user.update({
      where: {
        id: args.userId,
      },
      data: dataTosave,
    });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
