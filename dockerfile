# Використовуємо офіційний Node.js образ як базовий
FROM node:16-alpine

# Встановлюємо робочу директорію
WORKDIR /app

# Копіюємо package.json та package-lock.json
COPY package*.json ./

# Встановлюємо залежності
RUN npm install

# Копіюємо всі файли у робочу директорію
COPY . .

# Виставляємо порт
EXPOSE 8080

# Запускаємо додаток
CMD ["npm", "run", "serve"]
