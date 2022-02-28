#!/bin/bash
user="db.users.insertOne({username:\"simulator\",email:\"simulator@gmail.com\",pw_hash:\"\$2a\$10\$vpgwnJshZfoDBWRnqR21A.Y4nzSXQ0apAojRRvHbLhAuCLTg0ecfy\",admin:true,});"
source .env
mongo "mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@localhost:27017/${MONGO_INITDB_DATABASE}?authSource=admin" --eval $user