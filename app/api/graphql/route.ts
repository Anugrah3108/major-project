import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServer } from "@apollo/server";
import { NextRequest } from "next/server";
import {
  createUser,
  loginUser,
  updateUserProfile,
  updateUserRole,
} from "./resolver/user";
import { getUserFromCookies } from "@/service/helper";
import typeDefs from "./typeDefs";

const resolvers = {
  Query: {
    loginUser,
    currentUser: getUserFromCookies,
  },
  Mutation: {
    createUser,
    updateUserRole,
    updateUserProfile,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req) => ({ req }),
});

export { handler as GET, handler as POST };
