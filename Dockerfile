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
