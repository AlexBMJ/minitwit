#!/bin/bash
svn checkout https://github.com/AlexBMJ/minitwit/trunk/config
wget https://github.com/AlexBMJ/minitwit/raw/main/deployment.yml
sudo docker stack deploy -c deployment.yml minitwit
