# Use Node.js 18
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (bypass package-lock sync issues)
RUN npm install --production --no-package-lock

# Copy app files
COPY . .

# Expose port
EXPOSE 3000

# Start the bot
CMD ["node", "bot.js"] 