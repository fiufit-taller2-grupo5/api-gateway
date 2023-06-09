# We start from a node 18 image using alpine
FROM node:18-alpine

# The workdir inside the container where the following commands will be executed
WORKDIR /app

# Copy the package.json and package-lock.json files into the workdir
COPY package*.json ./

# Installs dependencies
RUN npm install

# Copies the rest of the files into the workdir 
COPY . .

RUN npx prisma generate

# Builds the app
RUN npm run build

# Exposes the port 80
EXPOSE 80

# Runs the app
CMD [ "npm", "start" ]
