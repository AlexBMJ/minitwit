#!/bin/bash
svn checkout https://github.com/AlexBMJ/minitwit/trunk/config
curl https://raw.githubusercontent.com/AlexBMJ/minitwit/main/deployment.yml -o deployment.yml
sudo docker stack deploy -c deployment.yml minitwit
