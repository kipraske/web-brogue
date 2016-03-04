# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  
  # name the VM for both VirtualBox and Vagrant
  config.vm.provider :virtualbox do |vb|
    vb.name = "brogue"
  end
  config.vm.define "brogue"

  ip_address = "192.168.50.50"
  config.vm.network "private_network", ip: ip_address

  config.vm.provision "setup",
    type: "shell",
    inline: <<-SHELL
      sudo apt-get update
      sudo apt-get install -y git build-essential mongodb node npm
      cd /srv && git clone https://github.com/notnmeyer/web-brogue.git
      cd /srv/web-brogue/server && npm install
      cd /srv/web-brogue/brogue && make web
    SHELL
  
  config.vm.provision "start-server",
    type: "shell",
    env: { SERVER_HOSTNAME: ip_address },
    inline: <<-SHELL
      cd /srv/web-brogue/server && nodejs ./server.js
    SHELL
end

