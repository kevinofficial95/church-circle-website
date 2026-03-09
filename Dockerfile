FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
ARG VITE_CONTACT_FORM_ENDPOINT
ENV VITE_CONTACT_FORM_ENDPOINT=${VITE_CONTACT_FORM_ENDPOINT}
RUN npm run build

FROM nginx:1.27-alpine AS runner
WORKDIR /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist ./

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
