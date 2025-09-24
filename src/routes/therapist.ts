

import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";
import { startTime } from "hono/timing";

export const doctorRouter = new Hono<{
  Bindings:{
    JWT_SECRET: string
    DATABASE_URL: string
  }
}>();

doctorRouter.post("/signin", async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body =  await c.req.json();
    const therapist = await prisma.therapist.findFirst({
        where:{
            email: body.email,
            password: body.password 

        }
    })

    //jwt token

    if(therapist){
        return c.text("login sucessful")

    }
    else {
        return c.text("login unsucessful")
    }

})

doctorRouter.post("/signup", async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    const body =  await c.req.json();
const therapist = await prisma.therapist.create({
  data: {
    email: body.email,
    password: body.password,
    name: body.name,
    workStart: body.workStart ? new Date(body.workStart) : null,
    workEnd: body.workEnd ? new Date(body.workEnd) : null,
  }
});

    //jwt token

    return c.text("Profile created successfully")

    

})


