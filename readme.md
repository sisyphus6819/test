n# Ayush Care Backend

This is the backend project for Ayush Care using Node.js, Prisma, PostgreSQL, and Cloudflare Workers.

Clone the repository:  
`git clone https://github.com/sisyphus6819/ayush.git`  
`cd backend`

Install dependencies:  
`npm install`

Create a `.env` file in the `prisma` folder:  
`DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<database>?schema=public`  
Add `.env` to `.gitignore`.

setup postgress db and generate prisma accelerate api key 

Configure Cloudflare Workers in `wrangler.toml` , put accelerate api key in `wrangler.toml` and db link in .env .

Initialize Prisma:  
`npx prisma init`  

Run migrations:  
`npx prisma migrate dev --name init`  

Optional: view the database with Prisma Studio:  
`npx prisma studio`

Start the development server:  
`npm run dev`


