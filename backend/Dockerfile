FROM node:16-alpine

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Add error handling for startup
CMD ["sh", "-c", "node src/index.js || (echo 'Application failed to start' && exit 1)"]

EXPOSE 8080 