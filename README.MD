nano /etc/environment
LC_ALL=en_US.UTF-8
LANG=en_US.UTF-8

sudo apt-get update
sudo apt-get upgrade

apt-get install mosh

curl -sL https://deb.nodesource.com/setup_5.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install git

sudo apt-get install python-pip python-dev

sudo pip install --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.6.0-cp27-none-linux_x86_64.whl

git clone https://github.com/AndrusAsumets/hamming-worker.git

cd hamming-worker

npm install

python classify_image.py

osx: add to .bash_profile -> export PATH=/usr/local/bin:$PATH

mkdir data && mkdir data/images

node init

add machine ip to queue's .workers.json
