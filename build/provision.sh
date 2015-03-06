#!/bin/bash

# Install things with apt 
sudo apt-get update
sudo apt-get install -y build-essential
sudo apt-get install -y git
curl -sL https://deb.nodesource.com/setup | sudo bash - #official script for node ppa
sudo apt-get install -y nodejs
sudo apt-get install -y mongodb
# Global NPM packages  
sudo npm install -g n
sudo n stable
# MongoDB configuration
# TODO - ensure we bind our db to local only - perhaps make config file here
sudo mkdir -p /data/db  
