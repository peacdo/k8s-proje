FROM node:16-alpine@sha256:a1f9d027912b58a7c75be7716c97cfbc6d3099f3a97ed84aa490be9dee20e787

WORKDIR /app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install

# Copy application code
COPY . .

# Add error handling for startup
CMD ["sh", "-c", "node src/index.js || (echo 'Application failed to start' && exit 1)"]

EXPOSE 8080 