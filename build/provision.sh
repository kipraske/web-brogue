#!/bin/bash

# Install things with apt 
sudo apt-get update
sudo apt-get install git
sudo apt-get install -y nodejs
sudo apt-get install mongodb
# Global NPM packages  
sudo npm install -g n
sudo n stable
# MongoDB configuration
# TODO - ensure we bind our db to local only - perhaps make config file here
sudo mkdir -p /data/db  
