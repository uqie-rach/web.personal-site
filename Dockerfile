# ===== Stage 1: Build the Next.js app =====
FROM node:20 AS builder

WORKDIR /app

# Copy dependency manifests
COPY package*.json ./

# Install dependencies
RUN npm install --legacy-peer-deps

# Copy source code
COPY . .

# Build the app
RUN npm run build

# ===== Stage 2: Run the production server =====
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the build output and required files
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Install only production dependencies
RUN npm install --legacy-peer-deps --omit=dev

# Expose port
EXPOSE 3000

# Start Next.js
CMD ["npm", "start"]
