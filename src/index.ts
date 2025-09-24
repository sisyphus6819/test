

import { Hono } from "hono";
import { UserRouter } from "./routes/user";

import { cors } from 'hono/cors'
import { doctorRouter } from "./routes/therapist";
import { bookings } from "./routes/booking";


const app = new Hono();

app.use('/*', cors())


app.route("/api/v1/user",UserRouter)
app.route("/api/v1/therapist",doctorRouter)
app.route("/api/v1",bookings)


export default app;



