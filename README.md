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
uploads/docs/login.png
uploads/docs/signup.png

##home page
uploads/docs/homepage1.png
uploads/docs/homepage2

##createpost
uploads/docs/createpost1.png

##comment/like
uploads/docs/commentlike.png

##delete
uploads/docs/delete.png

##crop
uploads/docs/cropsave.png

##search
uploads/docs/search.png

##full web video
[uploads/docs/video.mp4](https://drive.google.com/file/d/1L0SuuH2iXkGCfuxXvsrF5SQIYcygAUCx/view?usp=sharing)
