FROM node:18

WORKDIR /app

ENV PGHOST=postgres
ENV PGUSER=myuser
ENV PGPASSWORD=secret
ENV PGDATABASE=testdb
ENV PGPORT=5432
ENV PORT=3000

COPY ./package.json ./
RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
