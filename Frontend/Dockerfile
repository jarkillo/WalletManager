# Usar una imagen base con Node.js
FROM node:14-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /app

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install app dependencies
COPY package.json package-lock.json ./
RUN npm install --silent

# Add app
COPY . ./

# Start app
CMD ["npm", "start"]
