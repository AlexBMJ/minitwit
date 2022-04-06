#!/bin/bash
svn checkout https://github.com/AlexBMJ/minitwit/trunk/config
sudo docker stack deploy -c deployment.yml minitwit