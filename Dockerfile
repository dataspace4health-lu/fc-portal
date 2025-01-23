# Step 1: Use an official Node.js runtime as a base image
FROM node:20-alpine

# Step 2: Set working directory
WORKDIR /usr/app

# Step 3: Copy "package.json" and "package-lock.json"
COPY package*.json tsconfig.json ./

# Step 4: Install dependencies
RUN npm install --legacy-peer-deps

# Step 5: Copy the rest of the application
COPY . .

# Step 6: Build the application
RUN npm run build

# Step 7: Expose the application port
EXPOSE 3000

# Step 8: Start the application
CMD ["npm", "start"]