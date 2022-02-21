## Refactored Minitwit to use Next.js (React Framework) and pass the simulation python script!

Deploy using ``docker compose up``. It will start both the MongoDB database and the production ready application.

**.ENV**
```
MONGO_INITDB_ROOT_PASSWORD="<your password>"
MONGO_INITDB_ROOT_USERNAME="<your username>"
MONGO_INITDB_DATABASE="minitwit"
CONNECTION_STRING="mongodb://<your username>:<password>@db:27017/minitwit?authSource=admin"
TOKEN_SECRET="<token secret>"
```
