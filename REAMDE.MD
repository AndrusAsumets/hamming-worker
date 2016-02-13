sudo apt-get update
sudo apt-get upgrade

nano /etc/environment
LC_ALL=en_US.UTF-8
LANG=en_US.UTF-8

apt-get install mosh

curl -sL https://deb.nodesource.com/setup_4.x | sudo -E bash -
sudo apt-get install -y nodejs

sudo apt-get install git

git clone https://github.com/AndrusAsumets/hamming-worker.git

sudo apt-get install python-pip python-dev
sudo pip install --upgrade https://storage.googleapis.com/tensorflow/linux/cpu/tensorflow-0.6.0-cp27-none-linux_x86_64.whl

cd hamming-worker

npm install

python classify_image.py


node init

add ip to queue's .workers.json
