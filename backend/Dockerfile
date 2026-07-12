FROM node:20-alpine

# Set Working Directory
WORKDIR /app

# Copy dependency configs
COPY package*.json ./

# Install only production dependencies
RUN npm install --production

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start server
CMD ["npm", "start"]
