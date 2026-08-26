# Deployment Guide (Render + Docker)

This document provides a comprehensive guide on how to deploy this full-stack application (React/Vite Frontend + Node.js/Express Backend) using Docker on Render.

## Why Use Docker for Full-Stack Apps?

Deploying a complex app (especially one with WebSockets for chatting) can be tricky. Docker solves many of these challenges:

1. **Unified Deployment (Single Service)**: Instead of deploying the frontend to Vercel/Netlify and the backend to Render (which means managing two services and worrying about CORS), Docker builds the React frontend and injects it straight into the Node backend's public `dist` folder. The entire full-stack app is served from a **single Render Web Service**.
2. **Zero Environment Issues ("It works on my machine")**: Docker packages your exact Node version, dependencies, and code into an isolated container. If it runs locally, it is guaranteed to run on Render without version conflicts.
3. **Seamless WebSockets (Chat Functionality)**: Because the frontend and backend are hosted on the exact same domain and port inside the Docker container, WebSocket connections (Socket.IO) for the chat functionality work flawlessly without complex proxying or CORS configurations.
4. **Portability**: If you ever want to move away from Render to AWS, DigitalOcean, or another provider, this exact `Dockerfile` will work there without needing to rewrite your deployment logic.

---

## How the Dockerfile Works (Two-Stage Build)

We use a **Two-Stage Build** to optimize performance and reduce server costs:

* **Stage 1 (Frontend Builder):** It installs frontend dependencies and runs `npm run build` to compile the Vite/React code into static HTML/CSS/JS files.
* **Stage 2 (Backend Production):** It installs only the backend dependencies, then **copies** the compiled static files from Stage 1 into the backend's `dist` folder. Finally, it starts the Node server (`node server.js`). 

The final Docker container is lightweight and only contains what is absolutely necessary to run the app.

---

## Step-by-Step: Deploying on Render

Follow these exact steps to get the app live on Render.

### 1. Prepare Your Code
Ensure your `Dockerfile` is pushed to the **root** of your GitHub repository.

### 2. Create a New Web Service
1. Go to your [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Web Service**.
3. Connect your GitHub repository (`Tarun8817/PerplexityClone`).

### 3. Configure the Web Service
On the setup screen, fill out the following settings:
* **Name:** `perplexity-clone` (or whatever you prefer)
* **Region:** (Select the one closest to your users)
* **Branch:** `main`
* **Root Directory:** *(LEAVE THIS COMPLETELY BLANK)*. If you type "Backend" here, Docker will fail to find the Frontend folder.
* **Environment (Runtime):** Select **`Docker`**. *(Render will automatically detect the `Dockerfile` in the root folder).*

### 4. Add Environment Variables
Scroll down to **Environment Variables** and click **Add Environment Variable**. You need to copy all the keys from your local `.env` file. 

For this app, ensure you include:
* `MONGO_URI` (Your MongoDB Atlas connection string)
* `JWT_SECRET` (A strong random string for user authentication)
* `GOOGLE_USER` (The Gmail address used for sending emails)
* `GOOGLE_REFRESH_TOKEN` (Your active OAuth2 refresh token from the Google Auth Playground)
* `GOOGLE_CLIENT_ID` (OAuth2 Client ID)
* `GOOGLE_CLIENT_SECRET` (OAuth2 Client Secret)
* `BASE_URL` (Set this to your live Render URL, e.g., `https://your-app.onrender.com`)

### 5. Deploy
Click **Create Web Service**. 

Render will now build the Docker image (which takes a few minutes to compile the frontend and backend) and launch your full-stack application on a single, secure URL. 

### Chat Section (WebSockets) Note
Because you are using Socket.IO for the real-time chat, using this single Docker container ensures that the Socket.IO client in the frontend automatically connects to the same origin URL that served the page. You do not need to configure any special WebSocket ports on Render; Render automatically routes `ws://` and `wss://` traffic over the default web port.

---

## Example Dockerfile

Here is the exact `Dockerfile` used for this project. It is placed in the root directory (parent folder) of the repository.

```dockerfile
# STAGE 1: Build the frontend
FROM node:20-alpine AS frontend_builder

WORKDIR /app

COPY ./Frontend/package*.json ./Frontend/
WORKDIR /app/Frontend
RUN npm install
COPY ./Frontend /app/Frontend
RUN npm run build

# STAGE 2: Fullstack image (Backend + compiled Frontend)
FROM node:20-alpine

WORKDIR /app

COPY ./Backend/package*.json ./Backend/
WORKDIR /app/Backend
RUN npm install

COPY ./Backend /app/Backend
COPY --from=frontend_builder /app/Frontend/dist /app/Backend/dist

EXPOSE 3000

CMD ["npm", "run", "start"]
```
