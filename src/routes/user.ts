
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { decode, sign, verify } from "hono/jwt";

export const UserRouter = new Hono<{
  Bindings:{
    JWT_SECRET: string
    DATABASE_URL: string
  }
}>();

UserRouter.post('/signup',async (c)=>{
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate())

    try{
        const body = await c.req.json()
         const user = await prisma.user.create({
      data: {
        name:body.name,
        email:body.email,
        password:body.password
      }
    })

      const jwtToken = await sign({id:user.id},c.env.JWT_SECRET)
       return c.json({
    jwtToken
  })
    }catch(err){

    console.error("Error parsing body:", err); // log full error for debugging
  return c.text(`Error: ${err instanceof Error ? err.message : String(err)}`, 400);

    }
    

    //zod validation

   
   

 
})


UserRouter.post('/signin', async (c)=>{
  const prisma = new PrismaClient({
  datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

   const body = await c.req.json()

   const user = await prisma.user.findFirst({
    where:{

      email:body.email,
      password:body.password
    }
   }) 

   if(user){
      const jwtToken = await sign({id:user.id},c.env.JWT_SECRET)
        return c.json({
    jwtToken
  })
   }
   else {
    return c.text("This email does't exists")
   }

      
  

})



