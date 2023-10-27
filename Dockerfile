# Builder stage
FROM node:16 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y python3 make g++
RUN npm install --only=development
COPY . .

# Build bcrypt package separately
RUN npm install bcrypt
RUN npm rebuild bcrypt --build-from-source

# Final production stage
FROM node:16-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]
