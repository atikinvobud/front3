Клонировать репозиторий:
```sh
git clone https://github.com/atikinvobud/front3
````

```sh
docker compose up --build
````
```sh
Первый сервер для пользователя запускаетя на порте 3000 
Второй сервер для админа запускается на порте 8080
для запуска вебсокета сервера надо прописать node ws-server.js
````
также доступна информация по api используя swagger на эндпоинте http://localhost:8080/api-docs
также доступна информация про graphql на эндпоинте http://localhost:3000/graphql
