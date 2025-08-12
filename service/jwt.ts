import jwt from "jsonwebtoken";

type PayLoad = {
  id: string;
};

export async function generateToken(data: PayLoad) {
  const token = await jwt.sign(data, process.env.JWT_SECRET as string);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const data = await jwt.verify(token, process.env.JWT_SECRET as string);
    return data as PayLoad;
  } catch (error) {
    console.log(error);
    return null;
  }
}
