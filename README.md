# Blog Platform

A full-stack blog platform built with Node.js, Express, PostgreSQL, and React.

## Features
- ✅ Authentication (JWT login/register)
- ✅ Blog Post CRUD (create, read, delete own)
- ✅ Profile (view own + public profile with posts)
- 🛠 Bonus: likes, comments (schema ready)


##clone the repo
bash
git clone <your-repo-link>.git
cd blogplatform


## Setup

### Backend
1. Copy `.env.example` to `.env` inside `backend/` and fill values.
   ```bash
   cp backend/.env.example backend/.env

  2. create databse.
psql -U <postgres_user> -d blogdb -f backend/db/create_table.sql

3.install & run.
cd backend
npm install
npm run dev

##frontend
cd blog-frontend
npm install
npm start


##Authentication 
uploads/docs/authimage.png

##home page
uploads/docs/homepage1.png
uploads/docs/homepage2

##createpost

uploads/docs/createpost1.png


