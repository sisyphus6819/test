

import { Prisma, PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";

export const bookings = new Hono<{
  Bindings:{
    JWT_SECRET: string
    DATABASE_URL: string
  }
}>();



bookings.post("/available-therapists", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate())

  try {
    const body = await c.req.json()
    const requestedStart = new Date(body.startTime)
    const requestedEnd = new Date(body.endTime)
    const specialization = body.specialization 

    //  Get all therapists matching specialization + working hours
    const therapists = await prisma.therapist.findMany({
      where: {
        // specialization: specialization ? { equals: specialization } : undefined,  => make specialization mandatory then use thus to filyer out the doctors based on specialization
        workStart: { lte: requestedStart },
        workEnd: { gte: requestedEnd },
      },
      include: { sessions: true },
    })

    // SFilter out therapists with conflicting sessions
    const availableTherapists = therapists.filter((t) => {
        if (!t.workStart || !t.workEnd) return false;
      const conflict = t.sessions.some(
        (s) =>
          requestedStart < s.endTime && requestedEnd > s.startTime // cleaner overlap check
      )
      return !conflict
    })

    return c.json({ success: true, availableTherapists })
  } catch (err: any) {
    return c.json(
      { success: false, message: "Error fetching availability", error: err.message },
      400
    )
  }
})

