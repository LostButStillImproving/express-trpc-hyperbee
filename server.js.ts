import {inferAsyncReturnType, initTRPC} from '@trpc/server';
import * as trpcExpress from '@trpc/server/adapters/express';
// @ts-ignore
import express from 'express';
import {z} from 'zod';
import {addUser, getUsers, getUsersById} from "./db";
// created for each request
const createContext = ({
                           req,
                           res,
                       }: trpcExpress.CreateExpressContextOptions) => ({}); // no context
type Context = inferAsyncReturnType<typeof createContext>;
const t = initTRPC.context<Context>().create();
export const appRouter = t.router({
    getusers: t.procedure.query(async (req) => {
        return await getUsers()
    }),

    getUserById: t.procedure.input(z.string()).query(async (req) => {
        return await getUsersById(req.input)
    }),

    createUser: t.procedure.input(z.object({
        name: z.string(),
        age: z.number(),
    })).mutation(async (input) => {
        return await addUser({name: input.input.name, age: input.input.age})
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
const app = express();
app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
        router: appRouter,
        createContext,
    }),
);
app.listen(4000);