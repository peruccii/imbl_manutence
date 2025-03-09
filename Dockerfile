FROM node:18

WORKDIR /app

# Copiar os arquivos necessários para o contêiner
COPY prisma ./
COPY package*.json ./

# Instalar dependências
RUN npm install

# Gerar o Prisma Client
RUN npx prisma generate

# Copiar o restante do código
COPY . .

# Expor a porta que seu app vai usar
EXPOSE 4000

# Comando para iniciar o servidor
CMD ["npm", "start"]